"use strict";

var csv = require( "csv" );

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
	console.info( "closed csv file", locations );
});

module.exports = locations;