(function (console) { "use strict";
var App = function() {
	this.currentData = "";
	this.connectionId = -1;
	this.comPort = null;
	var _g = this;
	this.webcamOutput = window.document.getElementById("webcamOutput");
	this.axesReadout = window.document.getElementById("axesReadout");
	this.rightAxesReadout = window.document.getElementById("rightAxesReadout");
	this.portSelect = window.document.getElementById("portSelect");
	this.outputDiv = window.document.getElementById("readout");
	window.navigator.webkitGetUserMedia({ video : true},$bind(this,this.handleVideo),$bind(this,this.videoError));
	window.addEventListener("gamepadconnected",function(e) {
		_g.output("gamepad connected: " + e.gamepad.id);
		_g.gamepad = e.gamepad;
	});
	chrome.serial.getDevices(function(e1) {
		var _g1 = 0;
		var _g2 = e1.length;
		while(_g1 < _g2) {
			var i = _g1++;
			var option;
			var _this = window.document;
			option = _this.createElement("option");
			option.innerHTML = e1[i].path;
			_g.portSelect.appendChild(option);
		}
		_g.portSelect.onchange = function() {
			_g.connect(_g.portSelect.children[_g.portSelect.selectedIndex].innerHTML);
		};
		_g.connect(_g.portSelect.children[_g.portSelect.selectedIndex].innerHTML);
	});
	chrome.serial.onReceive.addListener(function(e2) {
		if(e2.connectionId != _g.connectionId) return;
		var data = new Uint8Array(e2.data);
		var $final = "";
		var _g11 = 0;
		while(_g11 < data.length) {
			var i1 = data[_g11];
			++_g11;
			$final += String.fromCharCode(i1);
			_g.output(i1 == null?"null":"" + i1);
		}
		if($final.indexOf("|") != -1) {
			_g.currentData += $final.substring(0,$final.indexOf("|"));
			_g.output("data recieved: " + _g.currentData);
			var pos = $final.indexOf("|") + 1;
			_g.currentData = HxOverrides.substr($final,pos,null);
		} else _g.currentData += $final;
	});
	var gamepadLoop = new haxe_Timer(100);
	gamepadLoop.run = function() {
		if(_g.gamepad == null) return;
		var currentGamepad = window.navigator.getGamepads()[_g.gamepad.index];
		var x = Math.round(currentGamepad.axes[0] * 100) / 100;
		var y = Math.round(currentGamepad.axes[1] * 100) / 100;
		if(Math.sqrt(Math.pow(x,2) + Math.pow(y,2)) < 0.35) {
			x = 0;
			y = 0;
		}
		if(x != 0) _g.send("1"); else _g.send("0");
		if(currentGamepad.buttons[0].pressed) _g.axesReadout.style.backgroundColor = "#aaaaaa"; else _g.axesReadout.style.backgroundColor = null;
		if(currentGamepad.buttons[1].pressed) _g.rightAxesReadout.style.backgroundColor = "#aaaaaa"; else _g.rightAxesReadout.style.backgroundColor = null;
		var left = 100 + x * 30;
		var top = 100 + y * 30;
		_g.axesReadout.style.left = left + "px";
		_g.axesReadout.style.top = top + "px";
		x = Math.round(currentGamepad.axes[2] * 100) / 100;
		y = Math.round(currentGamepad.axes[3] * 100) / 100;
		if(Math.sqrt(Math.pow(x,2) + Math.pow(y,2)) < 0.35) {
			x = 0;
			y = 0;
		}
		var right = 100 - x * 30;
		var top1 = 100 + y * 30;
		_g.rightAxesReadout.style.right = right + "px";
		_g.rightAxesReadout.style.top = top1 + "px";
	};
};
App.main = function() {
	window.onload = function() {
		new App();
	};
};
App.prototype = {
	output: function(msg) {
		this.outputDiv.innerHTML = msg + "\n" + this.outputDiv.innerHTML;
	}
	,connect: function(port) {
		var _g = this;
		if(this.connectionId != -1) chrome.serial.disconnect(this.connectionId,function(e) {
			console.log("disconnected: " + (e == null?"null":"" + e));
		});
		this.comPort = port;
		chrome.serial.connect(port,null,function(info) {
			_g.connectionId = info.connectionId;
			_g.send("test");
		});
	}
	,send: function(msg) {
		if(this.connectionId == -1) return;
		var byteArray = [];
		byteArray.push(0);
		var _g1 = 0;
		var _g = msg.length;
		while(_g1 < _g) {
			var i = _g1++;
			byteArray.push(HxOverrides.cca(msg,i));
		}
		byteArray.push(HxOverrides.cca("|",0));
		var dataBuffer = new Uint8Array(byteArray);
		chrome.serial.send(this.connectionId,dataBuffer.buffer,function(e) {
		});
		chrome.serial.flush(this.connectionId,function(e1) {
		});
	}
	,handleVideo: function(stream) {
		this.webcamOutput.src = URL.createObjectURL(stream);
	}
	,videoError: function(e) {
		console.log(e);
	}
};
var HxOverrides = function() { };
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
var haxe_Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
haxe_Timer.prototype = {
	run: function() {
	}
};
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
App.main();
})(typeof console != "undefined" ? console : {log:function(){}});
