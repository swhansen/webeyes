'use strict';

//
// Mongoose Schema for geo located AR object
//
var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

// geo schema per geoJson

var GeoSchema = new Schema( {
  type: {
    type: String,
    required: true,
    enum: [ 'Point', 'LineString', 'Polugon' ],
    default: 'Point'
  },
  coordinates: {
    type: [ Number ],
    index: '2dsphere'
  }
} );

//
//  Placed AR Object Schema
//

var visibility = [ 'public', 'private' ];

var geoArSchema = new Schema( {
    creator: String,
    publicPrivate: { type: String, enum: visibility, default: 'public' },
    createTime: { type:Date, default:Date.now },
    objectName: { type: String },
    arworld: { type: String },

    geometry: [ GeoSchema ],

    north: { type: Number, min: 0, max: 360 },
    gimble: { type: [ Number ], default: [ 0.0, 0.0, 0.0 ] },
    scale: { type: Number, default: 1.0 },
    isVisible: { type: Boolean, default: true }
  } );

module.exports = mongoose.model( 'GeoArObject', geoArSchema );
