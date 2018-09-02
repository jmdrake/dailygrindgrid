var dbProjects = new PouchDB("https://thathersessallyredernsin:5b391b98ab31e3c53b65c6aaa872698ec8bbdb39@55644244-4beb-4ca8-b177-8ff6d5c3cc0b-bluemix.cloudant.com/dailygrindprojects"); 

function ctrlsProjectsGetProjectList(parent, callback) {
    var results = [];
    dbProjects.allDocs({include_docs: true}, function(err, doc) {
        for(var i=0; i<doc.rows.length; i++) {
            if(doc.rows[i].doc["parent"]==parent)
                results[results.length] = doc.rows[i].doc;
        }
        callback(results);
    }).catch(function(err){callback(err)});
}

function ctrlsProjectsAddProject(name, parent, callback) {
    var newProject = {};
    newProject["name"] = name;
    newProject["_id"] = Date.now().toString();
    newProject["parent"] = parent == "" ? null : parent;
    dbProjects.put(newProject).then(function(response){
        dbProjects.get(response.id).then(function(newDoc){
            callback(newDoc)
        })
    }).catch(function (err) {
        console.log(err);
    });
}

function ctrlsProjectsGetProject(id, callback){
    dbProjects.get(id).then(function(doc){
        callback(doc)
    }).catch(function (err) {
        console.log(err);
    });
}

function ctrlsProjectsUpdateProject(doc){
    dbProjects.put(doc).catch(function(err){console.log(err)});
}

function ctrlsProjectsDeleteProject(project) {
    dbProjects.remove(project).catch(function(err){console.log(err)});
}
