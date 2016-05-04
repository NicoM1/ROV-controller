(function (console) { "use strict";
var App = function() {
	var _g = this;
	this.webcamOutput = window.document.getElementById("webcamOutput");
	this.axesReadout = window.document.getElementById("axesReadout");
	window.navigator.webkitGetUserMedia({ video : true},$bind(this,this.handleVideo),$bind(this,this.videoError));
	window.addEventListener("gamepadconnected",function(e) {
		haxe_Log.trace("gamepad connected.",{ fileName : "App.hx", lineNumber : 20, className : "App", methodName : "new", customParams : [e.gamepad.id,e.gamepad.index]});
		_g.gamepad = e.gamepad;
	});
	var gamepadLoop = new haxe_Timer(100);
	gamepadLoop.run = function() {
		if(_g.gamepad == null) return;
		var currentGamepad = window.navigator.getGamepads()[_g.gamepad.index];
		haxe_Log.trace(currentGamepad.axes[0],{ fileName : "App.hx", lineNumber : 28, className : "App", methodName : "new", customParams : [currentGamepad.axes[1]]});
		var x = Math.round(currentGamepad.axes[0] * 100) / 100;
		var y = Math.round(currentGamepad.axes[1] * 100) / 100;
		if(Math.abs(x) < 0.35) x = 0;
		if(Math.abs(y) < 0.35) y = 0;
		_g.axesReadout.innerHTML = "" + x + ", " + y;
	};
};
App.__name__ = true;
App.main = function() {
	window.onload = function() {
		new App();
	};
};
App.prototype = {
	handleVideo: function(stream) {
		this.webcamOutput.src = URL.createObjectURL(stream);
	}
	,videoError: function(e) {
		haxe_Log.trace(e,{ fileName : "App.hx", lineNumber : 43, className : "App", methodName : "videoError"});
	}
};
Math.__name__ = true;
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
