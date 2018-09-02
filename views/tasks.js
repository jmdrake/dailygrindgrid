$(document).ready(function(){
    $("#dailytasks").load("tasks.html", function(){
        var today = new Date();
        showTasks(today.toISOString().split('T')[0]);
        viewsTaskListInit();
    });
})

function viewsTaskListInit() {
    $(".btnDelete").on("click", function(event){
        var taskDiv = $(this).parent().parent();
        var id = taskDiv.find("#_id").val();
        ctrlsTasksGetTaskList(id, function(results){
            if(results.length == 0){
                var r = confirm("Delete this task?");
                if (r == true) {
                    ctrlsTasksGetTask(id, function(task){
                        ctrlsTasksDeleteTask(task);                    
                        taskDiv.hide();
                    })                      
                }
            } else {
                alert("Cannot delete task with subtasks")
            }
        })
    });

    $(".btnTimer").on("click", function(event){
        var taskDiv = $(this).parent().parent();
        $("#mdlTimer").find("#taskid").val(taskDiv.attr("id"))
        $("#mdlTimer").find("#timeelapsed").val(taskDiv.find(".timeelapsed").val());
        $("#lblTimeelapsed").html(formatms(taskDiv.find(".timeelapsed").val()))
        $("#mdlTimer").show();
    });
    
    $("#btnToggleTimer").on("click", function(event){
        event.stopImmediatePropagation();
        if(typeof(w)=="undefined")
            startWorker();
        else
            stopWorker();
    })
    
    $(".togglecompleted").on("change", function(event){
        var taskDiv = $(this).parent().parent();
        var id = taskDiv.find("#_id").val();
        ctrlsTasksGetTask(id, function(task){
            if(taskDiv.find(".togglecompleted").prop("checked")) {
                taskDiv.find("label").addClass("completed");
                task["completed"] = true;
            } else {
                taskDiv.find("label").removeClass("completed");
                task["completed"] = false;
            }
            ctrlsTasksUpdateTask(task);
        });
    });
    
    $("#chkShowTimes").on("change", function(event){
        if($(this).prop("checked")) {
            $(".lblTimeelapsed").show();
        } else {
            $(".lblTimeelapsed").hide();
        }
    });
    
    $("#btnAddTask").on("click", function(event){
        var project = $("#mdlNewTask").find("#project").val();
        var date = $("#mdlNewTask").find("#date").val();
        ctrlsTasksAddTask(project, date, function(task){
            console.log(task);
            var newTask = utilsFormcontrolsCloneDiv($("#tmplTask"), task, "");
            newTask.show();
            $("#lstTasks").append(newTask);
            $("#mdlNewTask").hide();
        })
    })
}

function showTasks(date) {
    var tmplTask = $("#tmplTask");
    tmplTask.hide();
    $("#lstTasks").html("");
    $("#lstTasks").append(tmplTask);
    ctrlsTasksGetTaskList(date, function(tasklist){
        utilsFormcontrolsPopulateDivList($("#lstTasks"), tasklist, tmplTask, {
            callback : function(div, data){
                // while(!ctrlsTasksProjectNames[data["project"]]);
                div.find("#name").html(ctrlsTasksProjectNames[data["project"]]);
                if(data["completed"]){
                    div.find("label").addClass("completed");
                    div.find(".togglecompleted").prop("checked", true);
                }
                div.attr("id", "task" + data["_id"]);
                var timeelapsed = data["timeelapsed"] ? data["timeelapsed"] : 0;
                div.find(".timeelapsed").val(timeelapsed);
                div.find(".lblTimeelapsed").html(formatms(timeelapsed));
            }
        });
        viewsEditlabelInit();
        viewsTaskListInit();
    });
}

function viewsTasksAddTask(){
    ctrlsTasksAddTask($("#newtask").val(), $("#parent").val(), function(newTaskDoc){
        var newTaskItem = utilsFormcontrolsCloneDiv($("#tmplTask"), newTaskDoc, "");
        newTaskItem.find("#namefield").val(newTaskDoc["name"]);
        $("#lstTasks").append(newTaskItem);
        viewsTaskListInit();
        viewsEditlabelInit();
        newTaskItem.show();
        $("#newtask").val("");
    })
}

var w;

function startWorker() {
    if(typeof(Worker) !== "undefined") {
        if(typeof(w) == "undefined") {
            w = new Worker("timerwebworker.js");
        }
        w.onmessage = function(event) {
            var timeelapsed = parseInt($("#timeelapsed").val());
            var fmtTimeelapsed = formatms(timeelapsed);
            $("#timeelapsed").val(timeelapsed + 1);
            $("#lblTimeelapsed").html(fmtTimeelapsed);
            var taskDiv = $("#" + $("#taskid").val());
            taskDiv.find(".lblTimeelapsed").html(fmtTimeelapsed);
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

