package;

import js.Browser;
import js.html.*;

class App {

	var webcamOutput: VideoElement;

	public function new() {
		webcamOutput = cast Browser.document.getElementById('webcamOutput');
		untyped Browser.navigator.webkitGetUserMedia({video: true}, handleVideo, videoError);
	}

	function handleVideo(stream) {
		webcamOutput.src = URL.createObjectURL(stream);
	}

	function videoError(e) {
		trace(e);
	}

    static function main() {
		new App();
    }
}
