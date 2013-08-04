"use strict";	

var SockStuff = require("./SockJSService");
var OpenLayerController = require("./OpenLayerController");

document.addEventListener( "DOMContentLoaded", initApplication );

function initApplication() {
	console.info( "Init" );
	
	var openLayerController = new OpenLayerController( "map" );
	
	openLayerController.addFeature();
	openLayerController.addFeature();
	openLayerController.addFeature();
	openLayerController.addFeature();
	openLayerController.addFeature();
	
	openLayerController.initializeMap();
}
