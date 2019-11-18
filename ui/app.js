var canvas = document.getElementById('video-canvas');

var urlParams = new URLSearchParams(window.location.search);
var repeats = 1
var duration = 200

stream = urlParams.get('stream');

host = urlParams.get('host');

port = urlParams.get('port');

secure = urlParams.get('secure');

data = urlParams.get('data');

debug = urlParams.get('debug');

if (host == null) {
	host = 'video.practable.io';
}

if (secure == null) {
	scheme = 'ws://'
	if (port == null){
		port = '8080';
	}
	
} else {
	scheme = 'wss://'
	if (port == null){
		port = '443';
	}
}

if (port == null){
	port = '80'
}

playerUrl = scheme + host + ':' + port + '/' + stream;

console.log(playerUrl)

var player = new JSMpeg.Player(playerUrl, {canvas: canvas});

dataUrl =  scheme + host + ':' + port + '/' + data;

console.log(dataUrl)

var wsOptions = {
	automaticOpen: true,
	reconnectDecay: 1.5,
	reconnectInterval: 500,
	maxReconnectInterval: 10000,
}

var dataSocket = new ReconnectingWebSocket(dataUrl, null,wsOptions);

var dataOpen = false;

var durationSlider = document.getElementById("durationParam");
var durationOutput = document.getElementById("durationValue");
durationOutput.innerHTML = durationSlider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
durationSlider.oninput = function() {
	durationOutput.innerHTML = this.value;
}

durationSlider.onchange = function() {
    console.log("duration", this.value)
    duration = this.value
    durationS = this.value / 1000.0
	dataSocket.send(JSON.stringify({
	    duration: durationS
	}));
}


var repeatSlider = document.getElementById("repeatParam");
var repeatOutput = document.getElementById("repeatValue");
repeatOutput.innerHTML = repeatSlider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
repeatSlider.oninput = function() {
	repeatOutput.innerHTML = this.value;
}

repeatSlider.onchange = function() {
    repeats = this.value
    console.log("repeats", repeats)
}

dataSocket.onopen = function (event) {
	console.log("dataSocket open");
	dataOpen = true; 

        durationS = durationSlider.value / 1000.0
	dataSocket.send(JSON.stringify({
	    duration: durationS
	}));
};

dataSocket.onmessage = function (event) {
	try {
	    // put any code to process incoming messages here
	    console.log(event.data)
	} catch (e) {
		if (debug){
			console.log(e)
		}
	}
}

document.getElementById("wink").onclick = function(){
    for (i = 0; i < repeats; i++) {
        sleep(duration * i * 2).then(() => {
	    console.log("winking")
	    dataSocket.send(JSON.stringify({which: ["left"]}));
        });
    }
}

document.getElementById("blink").onclick = function(){
    for (i = 0; i < repeats; i++) {
        sleep(duration * i * 2).then(() => {
	    console.log("blinking")
	    dataSocket.send(JSON.stringify({which: ["left","right"]}));
        });
    }
}

document.getElementById("all").onclick = function(){
    for (i = 0; i < repeats; i++) {
        sleep(duration * i * 2).then(() => {
	    console.log("alling")
	    dataSocket.send(JSON.stringify({which: ["left","right","bottom"]}));
        });
    }
}

document.getElementById("spin").onclick = function(){
    for (i = 0; i < repeats; i++) {
        sleep(duration * i * 3).then(() => {
	    console.log("spin 1")
	    dataSocket.send(JSON.stringify({which: ["left"]}));
        });
        sleep((duration * i * 3) + (duration * 1)).then(() => {
	    console.log("spin 2")
	    dataSocket.send(JSON.stringify({which: ["right"]}));
        });
        sleep((duration * i * 3) + (duration * 2)).then(() => {
	    console.log("spin 3")
	    dataSocket.send(JSON.stringify({which: ["bottom"]}));
        });
	
    }
}
document.getElementById("twinkle").onclick = function(){
    for (i = 0; i < repeats; i++) {
        sleep(duration * i * 2).then(() => {
	    console.log("twinkle top")
	    dataSocket.send(JSON.stringify({which: ["left","right"]}));
        });
        sleep((duration * i * 2) + (duration * 1)).then(() => {
	    console.log("twinkle bottom")
	    dataSocket.send(JSON.stringify({which: ["bottom"]}));
        });
    }
}

document.addEventListener("DOMContentLoaded", function(event) {
    // pick up the starting values set in the html for the sliders
    duration = durationSlider.value
    repeats = repeatSlider.value
});

//https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
// sleep time expects milliseconds
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}




