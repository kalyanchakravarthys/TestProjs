var preferredDateFormat = "MM/DD/YYYY";
var Task = function (data) {
    var self = this;
    self.TaskId = ko.observable(data ? data.TaskId : 0);
    self.TaskDesc = ko.observable(data ? data.TaskDesc : undefined).extend({ 
        required: { params: true, message: "Please enter task descrption." }, 
        maxLength: { params: 140, message: "Please describe the task in 140 characters." }
        });
    self.CreatedAt = ko.observable(data ? data.CreatedAt : undefined);
    self.LastUpdatedAt = ko.observable(data ? data.LastUpdatedAt : undefined);
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
                var self = this;
                self.MyTask = ko.observable(new Task(null));
            var savedTaskList = localStorage.getItem("TaskList");
            self.MyTaskList = ko.observableArray([]);
            if(savedTaskList && savedTaskList.length >0){
                for(i= 0; i< JSON.parse(savedTaskList).length; i++){
                    self.MyTaskList().push(new Task(JSON.parse(savedTaskList)[i]));
                }
                self.MyTaskList.notifySubscribers();
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
                    NewTask.CompletionDate(self.MyTask().CompletionDate() ? moment(self.MyTask().CompletionDate()).format(preferredDateFormat): "");
                    NewTask.IsCompleted(false);
                    self.MyTaskList().push(NewTask);
                    self.MyTaskList.notifySubscribers();
                    self.MyTask(new Task(null));
                    //Notify("Task added successfully!", "success");
                    localStorage.setItem("TaskList", JSON.stringify(ko.toJS(self.MyTaskList())));
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
                localStorage.setItem("TaskList", JSON.stringify(ko.toJS(self.MyTaskList())));
            }
            
            self.EditTask = function(t){
                self.MyTask(t);
            }

            
            self.UpdateTask = function(updatedT){
                var t = updatedT.TaskId ? updatedT : self.MyTask();
                ko.utils.arrayFirst(self.MyTaskList(), function(item) {
                    if(item.TaskId() === t.TaskId()){
                        item.TaskDesc(t.TaskDesc());
                        item.CompletionDate(t.CompletionDate());
                        item.IsCompleted(t.IsCompleted());
                        
                        return item;
                    }
                    
                });
                localStorage.setItem("TaskList", JSON.stringify(ko.toJS(self.MyTaskList())));
                self.MyTask(new Task(null));
            }
            
            self.CancelUpdate = function(){
                self.MyTask(new Task(null));
            }
            
           self.ClearStorage = function(){
                localStorage.TaskList = "";
                location.reload();
           }
    };
    var TaskVM = new TaskViewModel();
    ko.bindingHandlers.kendoEditor.options.tools = [];   
    ko.applyBindings(TaskVM, document.getElementById("todoList"));
};

vm();

