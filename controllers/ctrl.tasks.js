var dbTasks = new PouchDB("https://thathersessallyredernsin:5b391b98ab31e3c53b65c6aaa872698ec8bbdb39@55644244-4beb-4ca8-b177-8ff6d5c3cc0b-bluemix.cloudant.com/dailygrindtasks"); 

var ctrlsTasksProjectNames = {};

function ctrlsTasksGetTaskList(date, callback){
    var tasks = [];
    var semaphore = 0;
    dbTasks.allDocs({include_docs: true}, function(err, results) {
        for(var i=0; i<results.rows.length; i++) {
            var doc = results.rows[i].doc;
            if(doc["date"]==date) {
                tasks[tasks.length] = doc;
                semaphore++;
                dbProjects.get(doc["project"]).then(project=>{
                    ctrlsTasksProjectNames[project["_id"]] = project["name"];
                    semaphore--;
                    if(semaphore==0)
                        callback(tasks);
                })
            }
        }
    });
}

function ctrlsTasksAddTask(project, date, callback) {
    var newTask = {};
    newTask["project"] = project;
    newTask["date"] = date;
    newTask["_id"] = Date.now().toString();
    newTask["timeelapsed"] = null;

    dbTasks.put(newTask).then(responseTask => {
        dbProjects.get(project).then(responseProject => {
            newTask["name"] = responseProject["name"];
            callback(newTask)
        })
    }).catch(function (err) {
        console.log(err);
    });
}

function ctrlsTasksGetTask(id, callback){
    dbTasks.get(id).then(function(doc){
        callback(doc)
    }).catch(function (err) {
        console.log(err);
    });
}

function ctrlsTasksUpdateTask(doc){
    dbTasks.put(doc).catch(function(err){console.log(err)});
}

function ctrlsTasksDeleteTask(task) {
    dbTasks.remove(task).catch(function(err){console.log(err)});
}
