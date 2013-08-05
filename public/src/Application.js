"use strict";	

var OpenLayerController = require("./OpenLayerController");
var SockJSLocationReceiver = require("./SockJSLocationReceiver");

document.addEventListener( "DOMContentLoaded", initApplication );

function initApplication() {
	var openLayerController = new OpenLayerController( "map" );
	var sockJSLocationReceiver = new SockJSLocationReceiver( "/locations" );
	
	sockJSLocationReceiver.retrieveLocations( openLayerController );
}
