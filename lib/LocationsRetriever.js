"use strict";

var csv = require( "csv" );
var log4js = require("log4js");

var logger = log4js.getLogger( "LocationsRetriever" );

/**
 * CSV file reading.
 */
var locations = [];
var locationHeaders = [];

csv().from.path( "sample_data.csv", { delimiter: ',' }).
on( "record", function( row, index ){
	
	if( index === 0 ) {
		locationHeaders = row;
	} else {
		var location = "{" +
			row.map( function( locationValue, locationValueIndex ){
				return '"' + locationHeaders[locationValueIndex] + '":"' + locationValue + '"';
			} ).join(",")
		+ "}";
		
		locations.push( location );
	}
	
} ).
on( "end", function() {
	logger.info( "End of csv file, rows loaded [%d]", locations.length );
});

module.exports = locations;
