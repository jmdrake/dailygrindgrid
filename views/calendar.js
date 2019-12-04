$(document).ready(function(){
    $("#calendar").load("calendar.html", function(){
            var today = new Date();
			var dt = format_date(today);
			$("#task-date").val(dt);
			viewsCalendarRender(dt);
			$("#btnPrevMonth").on("click", function(){	
				var dt = $("#task-date").val().split("-");
				dt[2] = "15";
				var d = new Date(dt.join("-"));
				d.setDate(d.getDate() - 30);
				d.setDate(1);
				viewsCalendarRender(format_date(d));
				$("#task-date").val(format_date(d));
				showTasks(format_date(d));
			});
			$("#btnNextMonth").on("click", function(){				
				var dt = $("#task-date").val().split("-");
				dt[2] = "15";
				var d = new Date(dt.join("-"));
				d.setDate(d.getDate() + 33);
				d.setDate(1);
				viewsCalendarRender(format_date(d));
				$("#task-date").val(format_date(d));
				showTasks(format_date(d));
			});		
        });
    }
);

function viewsCalendarRender(d)
{	
	var month_name = ['January','February','March','April','May','June','July','August','September','October','November','December'];
	var dt = d.split("-");
	var month = parseInt(dt[1]);
	var year = parseInt(dt[0]);
	var first_date = month_name[month] + " " + 1 + " " + year;
	//September 1 2014
	var tmp = new Date(first_date).toDateString();
	//Mon Sep 01 2014 ...
	var first_day = tmp.substring(0, 3);    //Mon
	var day_name = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
	var day_no = day_name.indexOf(first_day);   //1
	var days = new Date(year, month, 0).getDate();    //30
	//Tue Sep 30 2014 ...
	var calendar = get_calendar(day_no, days);
	document.getElementById("calendar-month-year").innerHTML = month_name[month-1]+" "+year;
	document.getElementById("calendar-dates").innerHTML = "";
	document.getElementById("calendar-dates").appendChild(calendar);	
	show_tasks(month, year);
}

function show_tasks(month, year)
{
	ctrlsTasksForMonth(month, year, function(tasks){
		for(var i = 0; i < tasks.length; i++) {
			var day = parseInt(tasks[i].date.split("-")[2]);			
			$("#day" + day).html(day + '<i class="fas fa-tasks"></i>');
		}
		$(".fa-tasks").on("click", function(){
			var dt = $("#task-date").val().split("-");
			var day = padzero($(this).parent().attr("id").split("day")[1]);
			dt[2] = day;			
			$("#task-date").val(dt.join("-"));
			showTasks($("#task-date").val());
		})
	})
	
}
function format_date(today)
{
	var dd = padzero(today.getDate().toString());

	var mm = padzero((today.getMonth()+1).toString()); 
	var yyyy = today.getFullYear();	
	return yyyy + "-" + mm + "-" + dd;
}

function padzero(s)
{
	if(s.length == 1)
		return "0" + s;
	else
		return s;
}

function get_calendar(day_no, days){
    var table = document.createElement('table');
    var tr = document.createElement('tr');
    
    //row for the day letters
    for(var c=0; c<=6; c++){
        var td = document.createElement('td');
        td.innerHTML = "SMTWTFS"[c];
        tr.appendChild(td);
    }
    table.appendChild(tr);
    
    //create 2nd row
    tr = document.createElement('tr');
    var c;
    for(c=0; c<=6; c++){
        if(c == day_no){
            break;
        }
        var td = document.createElement('td');
        td.innerHTML = "";
        tr.appendChild(td);
    }
    
    var count = 1;
    for(; c<=6; c++){
        var td = document.createElement('td');
		td.setAttribute("id", "day" + count);
        // td.innerHTML = count + '<i class="fas fa-tasks"></i>';
		td.innerHTML = count;
        count++;
        tr.appendChild(td);
    }
    table.appendChild(tr);
    
    //rest of the date rows
    for(var r=3; r<=7; r++){
        tr = document.createElement('tr');
        for(var c=0; c<=6; c++){
            if(count > days){
                table.appendChild(tr);
                return table;
            }
            var td = document.createElement('td');
			td.setAttribute("id", "day" + count);
            // td.innerHTML = count + '<i class="fas fa-tasks"></i>';
            td.innerHTML = count;
            count++;
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    return table;
}