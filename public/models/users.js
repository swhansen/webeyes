var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var userSchema = new Schema( {
  firstName: String,
  lastName: String,
  email: String,
  org: String,
  password: String,
  phone: String,
  userStatus: String
} );

module.exports = mongoose.model( 'User', userSchema );
