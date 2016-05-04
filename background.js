chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create( 'app.html', {
        'outerBounds': { 'width': 1280, 'height': 1024 }
    });
});
