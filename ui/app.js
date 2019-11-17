var canvas = document.getElementById('video-canvas');

var urlParams = new URLSearchParams(window.location.search);
var repeats = 1

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
	dataSocket.send(JSON.stringify({
		duration: this.value
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

	dataSocket.send(JSON.stringify({
	    duration: durationSlider.value
	}));
};

dataSocket.onmessage = function (event) {
	try {
	    // put code to process incoming messages here
	    console.log(event.data)
	} catch (e) {
		if (debug){
			console.log(e)
		}
	}
}

//<article>
//<button id="wink" class="button">Wink</button>
//<button id="blink" class="button">Blink</button>
//<button id="all" class="button">All</button>
//<button id="spin" class="button">Spin</button>
//<button id="twinkle" class="button">Twinkle</button>

document.getElementById("wink").onclick = function(){
         
	dataSocket.send(JSON.stringify({which: ["left"]	}));
    for (i = 0; i < repeats; i++) {
	console.log("winking again", repeats - i)
	dataSocket.send(JSON.stringify({which: []}));
	dataSocket.send(JSON.stringify({which: ["left"]}));
    }
}




