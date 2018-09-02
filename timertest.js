var w;


function startWorker() {
    if(typeof(Worker) !== "undefined") {
        if(typeof(w) == "undefined") {
            w = new Worker("views/timerwebworker.js");
        }
        w.onmessage = function(event) {
            $("#counter").val(event.data);
            $("#elapsedtime").html(formatms(event.data));
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