var Menu = function(data){
	var self = this;
	self.Name = ko.observable(data ? data.Name : "");
	self.ChangeView = function(e){
		if(self.Name() == "Task Manager"){
			$("#todoList").show();
			$("#subsecquence").hide();
		}
		else if(self.Name() == "Subsecquence Counter"){
			$("#todoList").hide();
			$("#subsecquence").show();
		}
	}
}

var MenuViewModel = function(){
	 var self = this;
	
	self.Menus = ko.observableArray([]);
	self.Menus().push(new Menu({ Name: "Task Manager"}));
	self.Menus().push(new Menu({ Name: "Subsecquence Counter"}));
	self.Menus()[0].ChangeView();
	
}

var MenuVM = new MenuViewModel();  
ko.applyBindings(MenuVM, document.getElementById("menu"));