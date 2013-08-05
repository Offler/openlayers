"use strict";

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
    this.map.setCenter( center, 5 );
};

OpenLayerController.prototype.addFeature = function( longitude, latitude, account ) {
	var featurePoint = new OpenLayers.Geometry.Point( longitude, latitude );
	var geometry = toMercator( featurePoint );
	var attributes = {
            account : account
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
	var layerOptions = {
	    eventListeners:{
	        'featureselected':function(evt){
	            var feature = evt.feature;
	            var popup = new OpenLayers.Popup.FramedCloud("popup",
	                OpenLayers.LonLat.fromString(feature.geometry.toShortString()),
	                null,
	                "<div style='font-size:.8em'>Account: " + feature.attributes.account + "</div>",
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
	};
	
	var vector = new OpenLayers.Layer.Vector( "Points", layerOptions );
	
	vector.addFeatures( this.features );
	
	return vector;
};

OpenLayerController.prototype._createSelectFeatureControl = function( vector ) {
	return new OpenLayers.Control.SelectFeature(vector, {
	    hover:true,
	    autoActivate:true
	}); 
};

OpenLayerController.prototype._calculateMapCenter = function() {
	var center = toMercator({x:-3.990298,y:53.763569});
	
	return new OpenLayers.LonLat(center.x,center.y);
};

module.exports = OpenLayerController;
