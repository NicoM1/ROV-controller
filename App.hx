package;

import js.Browser;
import js.html.*;
import js.html.Uint8Array;

import haxe.Timer;

import chrome.Serial;

class App {

	var webcamOutput: VideoElement;
	var axesReadout: DivElement;
	var rightAxesReadout: DivElement;
	var portSelect: SelectElement;
	static var outputDiv: DivElement;
	static var gamepad: Dynamic;

	var comPort: String = null;
	var connectionId: Int = -1;

	var currentData: String = '';

	public function new() {
		webcamOutput = cast Browser.document.getElementById('webcamOutput');
		axesReadout = cast Browser.document.getElementById('axesReadout');
		rightAxesReadout = cast Browser.document.getElementById('rightAxesReadout');
		portSelect = cast Browser.document.getElementById('portSelect');
		outputDiv = cast Browser.document.getElementById('readout');

		Browser.window.onunload = function() {
			Serial.disconnect(connectionId, function(e) {
				trace('disconnected: ' + connectionId, e);
			});
		}

		for(o in oldMessages) {
			output(o);
		}
		oldMessages = null;

		untyped Browser.navigator.webkitGetUserMedia({video: true}, handleVideo, videoError);

		Serial.getDevices(function(e) {
			for(i in 0...e.length) {
				var option = Browser.document.createOptionElement();
				option.innerHTML = e[i].path;
				portSelect.appendChild(option);
			}
			portSelect.onchange = function() {
				connect(portSelect.children[portSelect.selectedIndex].innerHTML);
			}
			connect(portSelect.children[portSelect.selectedIndex].innerHTML);
		});

		Serial.onReceive.addListener(function(e) {
			trace('yes');
			if(e.connectionId != connectionId) return;
			var data = new Uint8Array(e.data);
			var final: String = '';
			for(i in data) {
				final += String.fromCharCode(i);
				//output(Std.string(i));
			}

			while(final.indexOf('|') != -1) {
				currentData += final.substring(0, final.indexOf('|'));
				output('data recieved: ' + currentData);
				currentData = '';
				final = final.substr(final.indexOf('|') + 1);
			}
			if(final.length > 0) {
				currentData += final;
			}
		});

		var gamepadLoop: Timer = new Timer(100);
		gamepadLoop.run = function() {
			if(gamepad == null) return;
			var currentGamepad = Browser.navigator.getGamepads()[gamepad.index];
			var x: Float = Math.round(currentGamepad.axes[0] * 100)/100;
			var y: Float = Math.round(currentGamepad.axes[1] * 100)/100;
			if(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) < 0.35) {
				x = 0;
				y = 0;
			}

			if(x != 0) {
				send('1');
			}
			else {
				send('0');
			}

			if(currentGamepad.buttons[0].pressed) {
				axesReadout.style.backgroundColor = "#aaaaaa";
			}
			else {
				axesReadout.style.backgroundColor = null;
			}

			if(currentGamepad.buttons[1].pressed) {
				rightAxesReadout.style.backgroundColor = "#aaaaaa";
			}
			else {
				rightAxesReadout.style.backgroundColor = null;
			}

			var left: Float = 100 + x*30;
			var top: Float = 100 + y*30;
			axesReadout.style.left = left + 'px';
			axesReadout.style.top = top + 'px';

			x = Math.round(currentGamepad.axes[2] * 100)/100;
			y = Math.round(currentGamepad.axes[3] * 100)/100;
			if(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) < 0.35) {
				x = 0;
				y = 0;
			}

			var right: Float = 100 - x*30;
			var top: Float = 100 + y*30;
			rightAxesReadout.style.right = right + 'px';
			rightAxesReadout.style.top = top + 'px';
		}
	}

	static var oldMessages: Array<String> = [];

	static function output(msg: String) {
		if(outputDiv == null) {
			oldMessages.push(msg);
			return;
		}
		outputDiv.innerHTML = msg + '\n' + outputDiv.innerHTML;
		if(outputDiv.innerHTML.length > 10000) {
			outputDiv.innerHTML = outputDiv.innerHTML.substring(0, 10000);
		}
	}

	function connect(port: String) {
		if(connectionId != -1) {
			Serial.disconnect(connectionId, function(e) {
				trace('disconnected: ' + e);
			});
		}
		comPort = port;
		Serial.connect(port, function(info: ConnectionInfo) {
			connectionId = info.connectionId;
			send('test');
		});
	}

	function send(msg: String) {
		if(connectionId == -1) return;
		var byteArray: Array<Int> = [];
		//byteArray.push(0);
		for(i in 0...msg.length) {
			byteArray.push(msg.charCodeAt(i));
		}
		byteArray.push('|'.charCodeAt(0));
		var dataBuffer: Uint8Array = new Uint8Array(byteArray);
		Serial.send(connectionId, dataBuffer.buffer, function(e) {
			//output('sent: ' + dataBuffer);
		});
		Serial.flush(connectionId, function(e) {
			//trace('data flushed: ' + e);
		});
	}

	function handleVideo(stream) {
		webcamOutput.src = URL.createObjectURL(stream);
	}

	function videoError(e) {
		trace(e);
	}

    static function main() {
		Browser.window.addEventListener('gamepadconnected', function (e) {
			output('gamepad connected: ' + e.gamepad.id);
			gamepad = e.gamepad;
		});
		Browser.window.onload = function() {
			new App();
		}
    }
}
