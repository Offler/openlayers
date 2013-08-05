"use strict";

function SockJSLocationReceiver( locationServiceUrl ) {
	this.locationServiceUrl = locationServiceUrl;
}

SockJSLocationReceiver.prototype.retrieveLocations = function( locationListener ) {
	var sock = new SockJS( this.locationServiceUrl );
	
	sock.onopen = function() {};

	sock.onmessage = function( e ) {
		var locationMessage = JSON.parse( e.data );
		
		if( locationMessage.Locations_Sent === true ) {
			locationListener.initializeMap();
		} else {
			locationListener.addFeature( locationMessage.Longitude, locationMessage.Latitude, locationMessage.Account );
		}
	};

	sock.onclose = function() {};
};

module.exports = SockJSLocationReceiver;
