$(document).ready(function(){
    $("#projecttasks").load("projects.html", function(){
        showProjects(null);
    });
});

function viewsProjectListInit(){
    $("#namefield").on("change", function(event)
    {
        var projectDiv = $(this).parent().parent();
        var id = projectDiv.find("#_id").val();
        ctrlsProjectsGetProject(id, function(project){
            project["name"] = projectDiv.find("#namefield").val();
            ctrlsProjectsUpdateProject(project);
        })
    });
    
    $("#lstProjects").find(".btnDelete").on("click", function(event){
        var projectDiv = $(this).parent().parent();
        var id = projectDiv.find("#_id").val();
        ctrlsProjectsGetProjectList(id, function(results){
            if(results.length == 0){
                var r = confirm("Delete this project?");
                if (r == true) {
                    ctrlsProjectsGetProject(id, function(project){
                        ctrlsProjectsDeleteProject(project);                    
                        projectDiv.hide();
                    })                      
                }
            } else {
                alert("Cannot delete project with subprojects")
            }
        })
    });

    $(".btnSubProject").on("click", function(event){
        event.stopImmediatePropagation();
        var projectDiv = $(this).parent().parent();
        subProject(projectDiv.find("#_id").val());
        $("#parentheader").show();
    });
    
    $(".projectToggleCompleted").on("change", function(event){
        var projectDiv = $(this).parent().parent();
        var id = projectDiv.find("#_id").val();
        ctrlsProjectsGetProject(id, function(project){
            if(projectDiv.find(".projectToggleCompleted").prop("checked")) {
                projectDiv.find("label").addClass("completed");
                project["completed"] = true;
            } else {
                projectDiv.find("label").removeClass("completed");
                project["completed"] = false;
            }
            ctrlsProjectsUpdateProject(project);
        });
    });    
    
    $("#lstProjects.btnAddTask").on("click", function(event){
        event.stopImmediatePropagation();
        var projectDiv = $(this).parent().parent();
        alert("Adding Task");
    });    
    
    $("#btnUpLevel").on("click", function(event){
        var parentProject = $("#parent").val();
        console.log("Up level");
        event.stopImmediatePropagation();
        ctrlsProjectsGetProject(parentProject, function(project){
            if(project["parent"] == null) {
                $("#parentheader").hide();
                $("#parent").val("");
                $("#header").html("");
                showProjects(null)
            } else {
                subProject(project["parent"]);
            }
        })
    });    
    
    $(".btnDate").on("click", function(event){
        event.stopImmediatePropagation();
        var projectDiv = $(this).parent().parent();
        var id = projectDiv.find("#_id").val();
        console.log("Creating project task for " + id);
        $("#mdlNewTask").find("#project").val(id);
        ctrlsProjectsGetProject(id, function(project){
            $("#mdlNewTask").find("#name").html(project["name"]);
            $("#mdlNewTask").show();
        });
    })
}

function subProject(id) {
    showProjects(id);
    ctrlsProjectsGetProject(id, function(project){
        $("#header").html(project["name"]);
        $("#parent").val(id);
    });
}

function showProjects(id) {
    var tmplProject = $("#tmplProject");
    
    tmplProject.hide();
    $("#lstProjects").html("");
    $("#lstProjects").append(tmplProject);
    console.log("Showing project");
    ctrlsProjectsGetProjectList(id, function(projectlist){
        utilsFormcontrolsPopulateDivList($("#lstProjects"), projectlist, tmplProject, {final : function(){
            viewsProjectListInit();
            viewsEditlabelInit();
        }});
    });
}

function viewsProjectsAddProject(){
    ctrlsProjectsAddProject($("#newproject").val(), $("#parent").val(), function(newProjectDoc){
        var newProjectItem = utilsFormcontrolsCloneDiv($("#tmplProject"), newProjectDoc, "");
        newProjectItem.find("#namefield").val(newProjectDoc["name"]);
        $("#lstProjects").append(newProjectItem);
        viewsProjectListInit();
        viewsEditlabelInit();
        newProjectItem.show();
        $("#newproject").val("");
    })
}

