var dbProjects = new PouchDB("projects");
var ibmurl = "https://thathersessallyredernsin:5b391b98ab31e3c53b65c6aaa872698ec8bbdb39@55644244-4beb-4ca8-b177-8ff6d5c3cc0b-bluemix.cloudant.com/dailygrindprojects";
//  dbIBMProjects = new PouchDB(ibmurl); 

dbProjects.sync(ibmurl, {batch_size:5, batch_limit:3});

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
    dbProjects.put(doc).then(function(res){console.log(res)}).catch(function(err){console.log(err)});
}

function ctrlsProjectsDeleteProject(project) {
    dbProjects.remove(project).catch(function(err){console.log(err)});
}

function ctrlsProjectGetProjectPath(project, callback)
{
	var path = project.name;
	if(project != null && project.parent != null)
		traversePath(project.parent, path, callback);	
	else
		callback(project.name);
		// console.log(project.name);
}

function traversePath(id, path, callback)
{
	if(id != null)
		ctrlsProjectsGetProject(id, function(parent){
			path = parent.name + "/" + path;
			if(parent.parent != null)
				traversePath(parent.parent, path, callback);
			else {
				callback(path);
			}						
		})
}
