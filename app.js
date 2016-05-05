(function (console) { "use strict";
var App = function() {
	this.connectionId = -1;
	this.comPort = null;
	var _g = this;
	this.webcamOutput = window.document.getElementById("webcamOutput");
	this.axesReadout = window.document.getElementById("axesReadout");
	this.portSelect = window.document.getElementById("portSelect");
	window.navigator.webkitGetUserMedia({ video : true},$bind(this,this.handleVideo),$bind(this,this.videoError));
	window.addEventListener("gamepadconnected",function(e) {
		haxe_Log.trace("gamepad connected.",{ fileName : "App.hx", lineNumber : 28, className : "App", methodName : "new", customParams : [e.gamepad.id,e.gamepad.index]});
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
		var left = 100 + x * 30;
		var top = 100 + y * 30;
		_g.axesReadout.style.left = left + "px";
		_g.axesReadout.style.top = top + "px";
	};
};
App.__name__ = true;
App.main = function() {
	window.onload = function() {
		new App();
	};
};
App.prototype = {
	connect: function(port) {
		var _g = this;
		if(this.connectionId != -1) chrome.serial.disconnect(this.connectionId,function(e) {
			haxe_Log.trace("disconnected: " + (e == null?"null":"" + e),{ fileName : "App.hx", lineNumber : 65, className : "App", methodName : "connect"});
		});
		this.comPort = port;
		chrome.serial.connect(port,null,function(info) {
			_g.connectionId = info.connectionId;
			_g.send("test");
		});
		chrome.serial.onReceive.addListener(function(info1) {
			if(_g.connectionId != info1.connectionId) return;
			haxe_Log.trace("serial data: " + Std.string(info1.data),{ fileName : "App.hx", lineNumber : 75, className : "App", methodName : "connect"});
		});
	}
	,send: function(msg) {
		var byteArray = [];
		var _g1 = 0;
		var _g = msg.length;
		while(_g1 < _g) {
			var i = _g1++;
			byteArray.push(HxOverrides.cca(msg,i));
		}
		var dataBuffer = new Uint8Array(byteArray);
		chrome.serial.send(this.connectionId,dataBuffer.buffer,function(e) {
			haxe_Log.trace("sent: " + Std.string(dataBuffer),{ fileName : "App.hx", lineNumber : 86, className : "App", methodName : "send", customParams : [e]});
		});
	}
	,handleVideo: function(stream) {
		this.webcamOutput.src = URL.createObjectURL(stream);
	}
	,videoError: function(e) {
		haxe_Log.trace(e,{ fileName : "App.hx", lineNumber : 95, className : "App", methodName : "videoError"});
	}
};
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
Math.__name__ = true;
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
var haxe_Log = function() { };
haxe_Log.__name__ = true;
haxe_Log.trace = function(v,infos) {
	js_Boot.__trace(v,infos);
};
var haxe_Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
haxe_Timer.__name__ = true;
haxe_Timer.prototype = {
	run: function() {
	}
};
var js_Boot = function() { };
js_Boot.__name__ = true;
js_Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
};
js_Boot.__trace = function(v,i) {
	var msg;
	if(i != null) msg = i.fileName + ":" + i.lineNumber + ": "; else msg = "";
	msg += js_Boot.__string_rec(v,"");
	if(i != null && i.customParams != null) {
		var _g = 0;
		var _g1 = i.customParams;
		while(_g < _g1.length) {
			var v1 = _g1[_g];
			++_g;
			msg += "," + js_Boot.__string_rec(v1,"");
		}
	}
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js_Boot.__unhtml(msg) + "<br/>"; else if(typeof console != "undefined" && console.log != null) console.log(msg);
};
js_Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str2 = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i1 = _g1++;
					if(i1 != 2) str2 += "," + js_Boot.__string_rec(o[i1],s); else str2 += js_Boot.__string_rec(o[i1],s);
				}
				return str2 + ")";
			}
			var l = o.length;
			var i;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js_Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
String.__name__ = true;
Array.__name__ = true;
App.main();
})(typeof console != "undefined" ? console : {log:function(){}});
