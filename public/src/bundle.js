;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./OpenLayerController":2,"./SockJSService":3}],2:[function(require,module,exports){
"use strict";

var latitudes = [52.959512, 52.926655, 51.645713, 53.763569, 52.539406];
var longitudes = [-1.361333, -1.176569, -3.990298, -1.578982, -1.404062];

var toMercator = OpenLayers.Projection.transforms['EPSG:4326']['EPSG:3857'];

function OpenLayerController( mapHolderId ) {
	this.features = [];
	this.mapHolderId = mapHolderId;
}

OpenLayerController.prototype.initializeMap = function() {
	this.map = new OpenLayers.Map( this.mapHolderId );

	var osm = new OpenLayers.Layer.OSM();
	var center = this._calculateMapCenter();
	var vector = this._createVectorOverlay();
	var selector = this._createSelectFeatureControl( vector );
	
	this.map.addControl( selector );
    this.map.addLayers( [osm, vector] );
    this.map.setCenter( center, 6 );
};

OpenLayerController.prototype.addFeature = function() {
	var featurePoint = new OpenLayers.Geometry.Point( longitudes.pop(), latitudes.pop() );
	var geometry = toMercator( featurePoint );
	var attributes = {
            foo : 100 * Math.random() | 0
    };
	var style = {
            fillColor : '#008040',
            fillOpacity : 0.8,                    
            strokeColor : "#ee9900",
            strokeOpacity : 1,
            strokeWidth : 1,
            pointRadius : 8
    };
	
    this.features.push( new OpenLayers.Feature.Vector( geometry, attributes, style ) );
};

OpenLayerController.prototype._createVectorOverlay = function() {
	var vector = new OpenLayers.Layer.Vector("Points",{
	    eventListeners:{
	        'featureselected':function(evt){
	            var feature = evt.feature;
	            var popup = new OpenLayers.Popup.FramedCloud("popup",
	                OpenLayers.LonLat.fromString(feature.geometry.toShortString()),
	                null,
	                "<div style='font-size:.8em'>Feature: " + feature.id +"<br>Foo: " + feature.attributes.foo+"</div>",
	                null,
	                true
	            );
	            feature.popup = popup;
	            this.map.addPopup(popup);
	        }.bind( this ),
	        'featureunselected':function(evt){
	            var feature = evt.feature;
	            this.map.removePopup(feature.popup);
	            feature.popup.destroy();
	            feature.popup = null;
	        }.bind( this )
	    }
	});
	
	vector.addFeatures( this.features );
	
	return vector;
};

OpenLayerController.prototype._createSelectFeatureControl = function( vector ) {
	return new OpenLayers.Control.SelectFeature(vector,{
	    hover:true,
	    autoActivate:true
	}); 
};

OpenLayerController.prototype._calculateMapCenter = function() {
	var center = toMercator({x:-3.990298,y:53.763569});
	
	return new OpenLayers.LonLat(center.x,center.y);
};

module.exports = OpenLayerController;

},{}],3:[function(require,module,exports){
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

},{}]},{},[1])
;