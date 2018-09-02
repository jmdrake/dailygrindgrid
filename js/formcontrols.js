function utilsFormcontrolsCloneDiv(template, record, href){
    var newDiv = template.clone();
    utilsFormcontrolsJson2Form(newDiv, record, href);
    return newDiv
}

function utilsFormcontrolsPopulateDivList(div, data, template, options) {
    if(options != undefined) {
		var callback = options["callback"];
		var href = options["href"];
		var prepend = options["prepend"];
		var final = options["final"];
	}	    
    var newDiv;
    for (var i = 0; i < data.length; i++) {
	    newDiv = utilsFormcontrolsCloneDiv(template, data[i], href);
		if(prepend == undefined)
			div.append(newDiv);
		else 
			div.prepend(newDiv);
		newDiv.show();
		if(callback != undefined)
			callback(newDiv, data[i]);
	}
	if(final != undefined)
	{
	    final();
	}
}

function utilsFormcontrolsJson2Form(div, record, href) {
    for(var key in record) {
        var element = div.find("#" + key);
        var value = unescape(record[key]);        
        if(element.get(0) != undefined)
            switch(element.get(0).tagName){
                case "INPUT":
                    element.val(value);
                    break;
                case "TEXTAREA":
                    element.val(value);
                    break;
                case "IMG":
                    if(value != "") {
                        element.attr("src", href + record[key]);
                        element.show();                        
                    }                        
                    break;
                case "AUDIO":
                    if (value != "") {
                        element.find("source").attr("src", href + record[key])
                        element.attr("style", "");                        
                    }                        
                    break;
                case "VIDEO":
                    if (value != "") {
                        element.find("source").attr("src", href + record[key])
                        element.attr("style", "");                        
                    }                  
                    break;
                default:
                    element.html(value);
                    break;
            }
    }    
}