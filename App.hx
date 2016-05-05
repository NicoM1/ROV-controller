package;

import js.Browser;
import js.html.*;
import js.html.Uint8Array;

import haxe.Timer;

import chrome.Serial;

class App {

	var webcamOutput: VideoElement;
	var axesReadout: DivElement;
	var portSelect: SelectElement;
	var gamepad: Dynamic;

	var comPort: String = null;
	var connectionId: Int = -1;

	public function new() {
		webcamOutput = cast Browser.document.getElementById('webcamOutput');
		axesReadout = cast Browser.document.getElementById('axesReadout');
		portSelect = cast Browser.document.getElementById('portSelect');
		untyped Browser.navigator.webkitGetUserMedia({video: true}, handleVideo, videoError);

		Browser.window.addEventListener('gamepadconnected', function (e) {
			trace('gamepad connected.', e.gamepad.id, e.gamepad.index);
			gamepad = e.gamepad;
		});

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

			var left: Float = 100 + x*30;
			var top: Float = 100 + y*30;
			axesReadout.style.left = left + 'px';
			axesReadout.style.top = top + 'px';
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
		Serial.onReceive.addListener(function(info) {
			if(connectionId != info.connectionId) return;
			trace('serial data: ' + info.data);
		});
	}

	function send(msg: String) {
		var byteArray: Array<Int> = [];
		for(i in 0...msg.length) {
			byteArray.push(msg.charCodeAt(i));
		}
		var dataBuffer: Uint8Array = new Uint8Array(byteArray);
		Serial.send(connectionId, dataBuffer.buffer, function(e) {
			trace('sent: ' + dataBuffer, e);
		});
	}

	function handleVideo(stream) {
		webcamOutput.src = URL.createObjectURL(stream);
	}

	function videoError(e) {
		trace(e);
	}

    static function main() {
		Browser.window.onload = function() {
			new App();
		}
    }
}
