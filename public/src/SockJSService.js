"use strict";

var sock = new SockJS('/echo');

sock.onopen = function() {
	console.log('open');
};

sock.onmessage = function(e) {
	console.log('message', e.data);
	
	sock.send("Hello back.");
};

sock.onclose = function() {
	console.log('close');
};
