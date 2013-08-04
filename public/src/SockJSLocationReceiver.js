"use strict";

function SockJSLocationReceiver( locationServiceUrl ) {
	this.locationServiceUrl = locationServiceUrl;
}

SockJSLocationReceiver.prototype.retrieveLocations = function( locationListener ) {
	var sock = new SockJS( this.locationServiceUrl );
	
	sock.onopen = function() {};

	sock.onmessage = function(e) {
		console.log('message', e.data);
		
		sock.send("Hello back.");
	};

	sock.onclose = function() {};
};

module.exports = SockJSLocationReceiver;
