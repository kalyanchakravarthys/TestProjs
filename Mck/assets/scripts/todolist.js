var preferredDateFormat = "MM/DD/YYYY",
errMsgLocalStorage = "This browser does not support saving data locally. Altough you can still add/edit/delete tasks, the data will not persist if you close the browser. For best experience, please try Google chrome!", 
errMsgSave = "The task is be added to the list, altough it is not saved to the local storage.";
errMsgUpdate = "The task is be updated in the list, altough it is not saved to the local storage.";
errMsgDelete = "This task is deleted from the list, altough this action is not saved to the local storage.";
errMsgClearStorage = "Clearing local storage is not necessary as we are not storing anything here!";
errMsgSortOrder = "Task list is sorted, but not saved to local storage.";

var Task = function (data) {
    var self = this;
    self.TaskId = ko.observable(data ? data.TaskId : 0);
    self.TaskDesc = ko.observable(data ? data.TaskDesc : undefined).extend({ 
        required: { params: true, message: "Please enter task descrption." }, 
        maxLength: { params: 140, message: "Please describe the task in 140 characters." }
        });
    self.CreatedAt = ko.observable(data ? data.CreatedAt : undefined);
    self.LastUpdatedAt = ko.observable(data ? data.LastUpdatedAt : undefined);
    self.LastUpdatedDateTime = ko.observable(data ? data.LastUpdatedDateTime : undefined);
    self.CompletionDate = ko.observable(data && data.CompletionDate ? moment(data.CompletionDate).format(preferredDateFormat) : undefined);
    self.IsCompleted = ko.observable(data ? data.IsCompleted : false);
    self.TaskStyle = ko.observable(data && data.IsCompleted ? "CompleteTask" : "IncompleteTask" );
    self.IsCompleted.subscribe(function () {
        self.TaskStyle(self && self.IsCompleted() ? "CompleteTask" : "IncompleteTask" );

    });
    self.Action = ko.observable(self.TaskId() == 0 ? "Create Task": "Update Task");

}


var vm = function () {
    var TaskViewModel = function () {
                var self = this;var savedTaskList;
                self.MyTask = ko.observable(new Task(null));
                self.MyTaskList = ko.observableArray([]);
                self.SortOrder = ko.observable(1);
                self.SortStyle = ko.observable("k-icon collapse");
                try{
                	savedTaskList = localStorage.getItem("TaskList");
                	savedSortOrder = localStorage.getItem("SortOrder");
                	savedSortStyle = localStorage.getItem("SortStyle");
                }
                catch(ex){
                	Notify(errMsgLocalStorage, "error");
                }
            if(savedTaskList && savedTaskList.length >0){
                for(i= 0; i< JSON.parse(savedTaskList).length; i++){
                    self.MyTaskList().push(new Task(JSON.parse(savedTaskList)[i]));
                }
                self.MyTaskList.notifySubscribers();
            }

            if(savedSortOrder){
            	self.SortOrder(JSON.parse(savedSortOrder));
            }
            
			if(savedSortStyle){
            	self.SortStyle(JSON.parse(savedSortStyle));
            	self.SortStyle.notifySubscribers();
            	self.SortStyle.valueHasMutated();
            }

            self.AddTask = function (t) {
                var NewTask = self.MyTask();
                var TaskErrors = ko.validation.group(self.MyTask());
                var errorCount = TaskErrors().length;
                //alert(errorCount);
                if(errorCount == 0){
                    var len = self.MyTaskList().length + 1;
                    NewTask.TaskId(len);
                    NewTask.CreatedAt(moment(new Date()).format(preferredDateFormat));
                    NewTask.LastUpdatedAt(moment(new Date()).format(preferredDateFormat));
                    NewTask.LastUpdatedDateTime(new Date());
                    NewTask.CompletionDate(self.MyTask().CompletionDate() ? moment(self.MyTask().CompletionDate()).format(preferredDateFormat): "");
                    NewTask.IsCompleted(false);
                    self.MyTaskList().push(NewTask);
                    self.MyTaskList.notifySubscribers();
                    self.MyTask(new Task(null));
                    //Notify("Task added successfully!", "success");
                    SaveDataToLocalStorage("TaskList", ko.toJS(self.MyTaskList()), errMsgSave);
                    var scrollHeight = $(".TaskItem:last-child").offset().top + $(".TaskItem:last-child").height();
                    $('html, .TaskList').animate({scrollTop:scrollHeight}, 'slow');
                    Blink(".TaskItem:last-child", 1);
                }	
                else{
                    for(i= 0; i< errorCount; i++){
                        Notify(TaskErrors()[i], "error");        
                    }
                    
                }
            }
            
            self.RemoveTask = function(t){
                self.MyTaskList.remove(t);
                self.MyTaskList.notifySubscribers();
                SaveDataToLocalStorage("TaskList", ko.toJS(self.MyTaskList()), errMsgDelete);
            }
            
            self.EditTask = function(t){
                self.MyTask(t);
            }

            
            self.UpdateTask = function(updatedT){
                var t = updatedT.TaskId ? updatedT : self.MyTask();
                ko.utils.arrayFirst(self.MyTaskList(), function(item) {
                    if(item.TaskId() === t.TaskId()){
                        item.TaskDesc(t.TaskDesc());
                        item.LastUpdatedAt(moment(new Date()).format(preferredDateFormat));
                        item.LastUpdatedDateTime(new Date());
                        item.CompletionDate(t.CompletionDate());
                        item.IsCompleted(t.IsCompleted());
                        return item;
                    }
                    
                });
                SaveDataToLocalStorage("TaskList", ko.toJS(self.MyTaskList()), errMsgUpdate);
                var id = t.TaskId();
                self.MyTask(new Task(null));
                //Scroll and blink effect to be shown only for update button click, not for completed status update.
                if(updatedT.TaskId == undefined){
                	var scrollHeight = $(".TaskItem[id='" + id + "']").css("top") ; 
             	   $('html, .TaskList').animate({ scrollTop: scrollHeight}, 'slow');
                	Blink(".TaskItem[id='" + id + "']", 1);
            	}
            }
            
            self.CancelUpdate = function(){
                self.MyTask(new Task(null));
            }
            
           self.ClearStorage = function(){
                SaveDataToLocalStorage("TaskList", "", errMsgClearStorage);
                location.reload();
           }

           self.SortTaskList = function(){
           	if(self.SortOrder() == 1){
           		//Ascending
           		self.MyTaskList().sort(function (l, r) { return l.LastUpdatedDateTime() > r.LastUpdatedDateTime() ? 1 : -1 });
           		self.SortOrder(2);
           		self.SortStyle("k-icon expand");
           	}
           	else{
           		//Descending
           		self.MyTaskList().sort(function (l, r) { return l.LastUpdatedDateTime() < r.LastUpdatedDateTime() ? 1 : -1 });
           		self.SortOrder(1);
           		self.SortStyle("k-icon collapse");
           	}
           	SaveDataToLocalStorage("TaskList", ko.toJS(self.MyTaskList()), errMsgUpdate);
           	SaveDataToLocalStorage("SortOrder", self.SortOrder(), errMsgSortOrder);
           	SaveDataToLocalStorage("SortStyle", self.SortStyle(), errMsgSortOrder);
			self.MyTaskList.notifySubscribers();
			self.SortStyle.notifySubscribers();
           }
    };
    var TaskVM = new TaskViewModel();
    ko.bindingHandlers.kendoEditor.options.tools = [];   
    ko.applyBindings(TaskVM, document.getElementById("todoList"));
};

vm();

