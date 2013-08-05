"use strict";

var SERVER_PORT = 8080;
var HOST = "127.0.0.1";

var http = require( "http" );
var sockjs = require('sockjs');
var log4js = require("log4js");
var NodeStaticServer = require( "node-static" ).Server;
var locations = require( "./LocationsRetriever" );

var sockJSServer = sockjs.createServer();
var logger = log4js.getLogger( "OpenLayerServer" );
var fileServer = new NodeStaticServer( "./public" );

/**
 * Node-static server set-up.
 */

logger.info( "Creating server and attempting to connect to port [%d], host [%s]", SERVER_PORT, HOST );

var httpServer = http.createServer( requestListener );

sockJSServer.on( "connection", sockJSConnectionHandler );
sockJSServer.installHandlers( httpServer, { prefix: '/locations' } );

httpServer.addListener( "error", connectionError ).
listen( SERVER_PORT, HOST, connectionSuccessful );

function requestListener( request, response ) {
	logger.info( "Request received [%s]", request.url );
	
	request.addListener( "end", requestHandler ).resume();
	
	function requestHandler() {
		fileServer.serve( request, response, nodeStaticResponseHandler );
	}
	
	function nodeStaticResponseHandler( error ) {
		if( error ) {
			logger.error( "Could not fulfill request", error );

            response.writeHead( error.status, error.headers );
            response.end();
		} else {
			logger.info( "Request fulfilled" );
		}
	}
}

function connectionSuccessful() {
	logger.info( "Server connection successful." );
}

function connectionError( error ) {
	logger.error( "Error while attempting connection!, [%s]", error.code );
}

/**
 * SockJS server set-up.
 */

function sockJSConnectionHandler( conn ) {
	
	locations.forEach( function( locationJSON ){
		conn.write( locationJSON );
	} );
	
	conn.write('{"Locations_Sent": true}');
	
    conn.on('data', function(message) {
    	logger.info( "Incoming", message );
    });
    
    conn.on('close', function() {});
}
