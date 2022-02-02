$(document).ready(function(){
    $("#dailytasks").load("/views/tasks.html", function(){
        var today = new Date();
		var dt = new Date(format_date(today) +"T00:00:00");
		showTasks(dt.toISOString().split('T')[0]);
        viewsTaskListInit();
		$("#task-date").on("change", function(){
			try {
				var dt = new Date($("#task-date").val()+"T00:00:00");
				showTasks(dt.toISOString().split('T')[0]);				
			} catch {
				console.log(dt);	
			}			
		});
		
		$("#chkShowTimes").on("change", function(event){
			if($(this).prop("checked")) {
				$(".times").show();
			} else {
				$(".times").hide();
			}
		});

		$("#btnAddTask").on("click", function(event){
			event.stopImmediatePropagation();
			var project = $("#mdlNewTask #project").val();
			var date = $("#mdlNewTask #date").val();
			var hours = $("#mdlNewTask #hours").val();
			var minutes = $("#mdlNewTask #minutes").val();
			var timeallocated = hours * 3600 + minutes * 60;
			ctrlsTasksAddTask(project, date, timeallocated, (task) => {
				console.log(task);
				var newTask = utilsFormcontrolsCloneDiv($("#tmplTask"), task, "");
				newTask.show();
				$("#todo-list").append(newTask);
				$("#mdlNewTask").hide();	
				viewsCalendarRender(task.date);
				viewsTaskListInit();
				var myDiv = newTask;
				ctrlsProjectsGetProject(task.project, (project) => {
					ctrlsProjectGetProjectPath(project, function(path){
						newTask.find(".name").html(path);						
					})					
				});
				$("#main header").show();
			})
		});			
    });	
})

function viewsTaskListInit() {
    $(".destroy").on("click", function(event){
        var taskDiv = $(this).parent().parent();
        var id = taskDiv.find("#_id").val();
        var r = confirm("Delete this task?");
        if (r == true) {
            ctrlsTasksGetTask(id, function(task){
                ctrlsTasksDeleteTask(task, function(res){console.log(res); viewsCalendarRender($("#task-date").val())});                    
                taskDiv.remove();		
				if($("#todo-list").children().length <= 1) {
					$("#main header").hide();
				}
            })                      
        }
    });

    $(".clock").on("click", function(event){
        var taskDiv = $(this).parent().parent();
		
		
        $("#mdlTimer #taskid").val(taskDiv.attr("id"))
        $("#mdlTimer #timeelapsed").val(taskDiv.find(".timeelapsed").val());
        $("#lblTimeElapsed").html(formatms(taskDiv.find(".timeelapsed").val()))
        $("#mdlTimer").show();
    });
    
    $("#btnToggleTimer").on("click", function(event){
        event.stopImmediatePropagation();
        if(typeof(w)=="undefined")
            startWorker();
        else
            stopWorker();
    })
    
    $(".chkTaskComplete").on("change", function(event){
        var taskDiv = $(this).parent().parent();
        var id = taskDiv.find("#_id").val();
        ctrlsTasksGetTask(id, function(task){
            if(taskDiv.find(".chkTaskComplete").prop("checked")) {
                taskDiv.find(".name").addClass("completed");
                task["completed"] = true;
            } else {
                taskDiv.find(".name").removeClass("completed");
                task["completed"] = false;
            }
            ctrlsTasksUpdateTask(task);
        });
    });	 
}

function showTasks(date) {
    var tmplTask = $("#tmplTask");
    tmplTask.hide();
    $("#todo-list").html("");
    $("#todo-list").append(tmplTask);
    ctrlsTasksGetTaskList(date, function(tasklist){
		if(tasklist.length > 0){
			$("#main header").show();
			utilsFormcontrolsPopulateDivList($("#todo-list"), tasklist, tmplTask, {
				callback : function(div, data){
					// while(!ctrlsTasksProjectNames[data["project"]]);                
					ctrlsProjectsGetProject(data.project, (project) => {
						ctrlsProjectGetProjectPath(project, function(path){
							div.find(".name").html(path);
						})					
					});				
					if(data["completed"]){
						div.find(".name").addClass("completed");
						div.find(".chkTaskComplete").prop("checked", true);
					}
					div.attr("id", "task" + data["_id"]);
					var timeelapsed = data["timeelapsed"] ? data["timeelapsed"] : 0;
					var timeallocated = data["timeallocated"] ? data["timeallocated"] : 0;
					div.find(".timeelapsed").val(timeelapsed);
					div.find(".lblTimeElapsed").html(formatms(timeelapsed));
					div.find(".lblTimeAllocated").html(formatms(timeallocated));
				}
			});			
		}
        viewsEditlabelInit();
        viewsTaskListInit();
    });
}

var w;

function startWorker() {
    if(typeof(Worker) !== "undefined") {
        if(typeof(w) == "undefined") {
            w = new Worker("timerwebworker.js");
        }
        w.onmessage = function(event) {
            var timeelapsed = parseInt($("#timeelapsed").val());
            var fmtTimeElapsed = formatms(timeelapsed);
            $("#timeelapsed").val(timeelapsed + 1);
            $("#lblTimeElapsed").html(fmtTimeElapsed);
            var taskDiv = $("#" + $("#taskid").val());
            taskDiv.find(".lblTimeElapsed").html(fmtTimeElapsed);
            taskDiv.find(".timeelapsed").val(timeelapsed);
            var id = taskDiv.find("#_id").val();
            ctrlsTasksGetTask(id, function(task){
                task["timeelapsed"] = taskDiv.find(".timeelapsed").val();
                ctrlsTasksUpdateTask(task);
            });
        };
    } else {
        console.log("Sorry! No Web Worker support.");
    }
}

function stopWorker() {
    w.terminate();
    w = undefined;
}

function formatms(ms) {
    var seconds = Math.floor(ms % 60);
    var minutes = Math.floor(ms / 60) % 60;
    var hours = Math.floor(ms / 3600);
    return hours.toString() + ":" + minutes.toString() + ":" + seconds.toString();
}

