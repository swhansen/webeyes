
//
// Mongoose Schema for geo located AR object
//
var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var GeoSchema = new Schema( {
  type: {
    type: String,
    default: 'Point'
  },
  coordinates: {
    type: [ Number ],
    index: '2dsphere'
  }
} );


var visibility = [ 'public', 'private' ];

var geoArSchema = new Schema( {

    creator: String,
    publicPrivate: { type: String, default: 'public', enum: visibility  },
    createTime: { type:Date, default:Date.now },
    objectName: String,
    arworld: String,

    geometry: [ GeoSchema ],

    north: { type: Number, min: 0, max: 360 },
    gimble: { type: [ Number ] },
    scale: { type: Number, default: 1.0 },
    isVisible: { type: Boolean, default: true }
} );

module.exports = mongoose.model( 'GeoArObject', geoArSchema );
