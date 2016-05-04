package;

import js.Browser;
import js.html.*;

import haxe.Timer;

class App {

	var webcamOutput: VideoElement;
	var axesReadout: ParagraphElement;
	var gamepad: Dynamic;

	public function new() {
		webcamOutput = cast Browser.document.getElementById('webcamOutput');
		axesReadout = cast Browser.document.getElementById('axesReadout');
		untyped Browser.navigator.webkitGetUserMedia({video: true}, handleVideo, videoError);

		Browser.window.addEventListener('gamepadconnected', function (e) {
			trace('gamepad connected.', e.gamepad.id, e.gamepad.index);
			gamepad = e.gamepad;
		});

		var gamepadLoop: Timer = new Timer(100);
		gamepadLoop.run = function() {
			if(gamepad == null) return;
			var currentGamepad = Browser.navigator.getGamepads()[gamepad.index];
			trace(currentGamepad.axes[0], currentGamepad.axes[1]);
			var x: Float = Math.round(currentGamepad.axes[0] * 100)/100;
			var y: Float = Math.round(currentGamepad.axes[1] * 100)/100;
			if(Math.abs(x) < 0.35) x = 0;
			if(Math.abs(y) < 0.35) y = 0;

			axesReadout.innerHTML = '$x, $y';
		}
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
