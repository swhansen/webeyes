var bodyParser = require( 'body-parser' );
var express    = require( 'express' );
var app        = express();
var socketIO         = require( 'socket.io' );
var rtc        = require( 'easyrtc' );
var mongoose   = require( 'mongoose' );
var cors       = require( 'cors' );
var http      = require( 'http' );
var bson      = require ( 'bson' );

var User = require( './public/models/users' );

var clients    = [];
var linecolors = [ 'rgba(255, 0, 0, 1)',
                   'rgba(255, 0, 225, 1)',
                   'rgba(255, 115, 0, 1)',
                    'rgba(0, 0, 225, 1)' ];
var room;

var mongoUriString =
  process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/heroku_app31783365';

var sendgridUsername = process.env.SENDGRID_USERNAME || 'app31783365@heroku.com';
var sendgridPassword = process.env.SENDGRID_PASSWORD || 'jja7gngo8427';

var sendgrid = require( 'sendgrid' )( sendgridUsername, sendgridPassword );

app.use( cors() );

app.use( '/js', express.static( __dirname + '/easyrtc/js' ) );
app.use( '/images', express.static( __dirname + '/easyrtc/images' ) );
app.use( '/css', express.static( __dirname + '/easyrtc/css' ) );

app.use( express.static( __dirname + '/public' ) );

//app.use( '/css', express.static( __dirname + '/public/css' ) );
//app.use( '/img', express.static( __dirname + '/public/img' ) );
//app.use( '/javascript', express.static( __dirname + '/public/javascripts' ) );

app.use( '/bower', express.static( __dirname + '/bower_components' ) );

// Needed to parse form data(changed for express 4.x)
app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( bodyParser.json() );

var loggedIn = false;
var password = 'weg2rt';

var handlebars = require( 'express-handlebars' )
  .create( {
    defaultLayout: 'main'
  } );

app.engine( 'hbs', handlebars.engine );
app.set( 'view engine', 'hbs' );

mongoose.connect( mongoUriString, function( err, res ) {
  if ( err ) {
  console.log( 'ERROR connecting to:' + mongoUriString + '. '  + err );
  } else {
  console.log ( 'Succeeded connecting to: ' + mongoUriString );
  }
} );

//var Schema = mongoose.Schema;
//  var userSchema = new Schema( {
//    firstName:String,
//    lastName:String,
//    email: String
//  } );
//
//  var Users = mongoose.model( 'users', userSchema );

// test for tests....
app.use( function( req, res, next ) {
  res.locals.showTests = app.get( 'env' ) !== 'production' &&
    req.query.test === '1';
  next();
} );

//  Main entry point

app.get( '/', function( req, res ) {
  console.log( 'Login attempt' );
  if ( loggedIn === true ) {
    res.sendFile( __dirname + '/views/static-multiparty.html' );
  } else {
    res.render( 'entry', {
      pageTestScript: '/qa/tests-entry.js'
    } );
  }
} );

//Respond to POST from login form
app.post( '/', function( req, res ) {
  if ( loggedIn === true ) {
    res.send( 'Already logged in.' );
  } else {
    console.log( 'Posted data:' + JSON.stringify( req.body ) );
    if ( req.body.password === password ) {
      room = req.body.roomname;
      loggedIn = true;
      res.send( 'logged in' );
      console.log( 'Logged in' );
      var easyrtcServer = rtc.listen(
            app,
            socketServer, { 'apiEnable': 'true' }
          );
    } else {
      res.send( 'Incorrect password.' );
    }
  }

// Session invite using SendGrid

var fromAddress = 'no-reply@weg2rt.com';
var toAddress = req.body.email;
var subject = 'WEG2RT Session Invite';
var inviteDate = new Date();
var mailInviteDate = inviteDate.toString();

var pleaseJoin = '<p>Please join the session using Chrome, Firefox or Opera at:' +
  ' </p><h3><a href=\'https://weg2rt-staging.herokuapp.com\' target=\'_blank\'>WEG2RT</a></h3>';
var tableStyle = '<table style=\'border: solid 1px #000; background-color: #666; font-family:verdana, tahoma, sans-serif; color: #fff;\'><tr> <td><h2>';

var mailTextBody = req.body.name +
  'has invited you to a WEG2RT Session. Join at https://weg2rt-staging.heroku.com' +
  req.body.msg;

var mailHtmlBody = tableStyle + req.body.name +
 ' has invited you to a WEG2RT Session</h2>' +
  req.body.msg + pleaseJoin + mailInviteDate + '</td></tr></table>';

try {
    sendgrid.send( {
        to:         toAddress,
        from:       fromAddress,
        subject:    subject,
        text:       mailTextBody,
        html:       mailHtmlBody
    }, function( err, json ) {
        if ( err ) { return console.error( err ); }
        console.log( json );
    } );
} catch ( e ) {
    console.log( e );
}
} );

//Serve a static logout page
app.get( '/logout', function( req, res ) {
  if ( loggedIn === true ) {
    res.sendfile( __dirname + '/public/logout.html' );
    console.log( 'logout page' );

  } else {
    res.send( 'Not logged in.' );
  }
} );

//Check the password to prevent unauthoried logouts
app.post( '/logout', function( req, res ) {
  if ( req.body.pw === password ) {
    if ( loggedIn === true ) {
      loggedIn = false;
      res.send( 'Logged out' );
      console.log( 'logged out' );

      //Consider killing all active sessions here
      easyrtc.setOption( 'apiEnable', 'false' );
    } else {
      res.send( 'You were already logged out' );
      console.log( 'Attempt to logout when not logged in' );
    }
  } else {
    console.log( 'Bad password attempt' );
    res.send( 'Incorrect password' );
  }
} );

//Initiate a video call
app.get( '/video', function( req, res ) {
  if ( loggedIn === true ) {
    res.sendfile( __dirname + '/views/static-multiparty.html' );
  } else {
    res.send( 'Please try later.' );
  }
} );

//
// Experiment with the user DB on Mongo
//

app.get( '/users', function( req, res ) {
  var query = User.find( {} ).limit( 10 );
  query.exec( function( err, docs ) {
        if ( err ) {
            throw Error;
        }
        res.render( 'users', { users: docs } );
    } );
} );

app.get( '/users/:lastName', function( req, res ) {
        if ( req.params.lastName ) {
        User.findOne( { lastName: req.params.lastName },
         function( err, docs ) {
            if ( err ) {
                throw Error;
            }
            res.render( 'lastname', docs );
        } );
    }
} );

//
// API
//

app.get( '/api', function( req, res ) {
    res.json( { message: 'Welcome to the WebEyes API!' } );
} );

app.get( '/api/users', function( req, res ) {

  var query = User.find( {} ).limit( 10 );
  query.exec( function( err, docs ) {
        if ( err ) {
            throw Error;
        }
        res.json( { message: docs } );
    } );

 //   res.json( { message: 'users from API' } );
} );

app.get( '/api/users/:lastName', function( req, res ) {
        if ( req.params.lastName ) {
        User.findOne( { lastName: req.params.lastName },
         function( err, docs ) {
            if ( err ) {
                throw Error;
            }
            res.json( { message: docs } );
        } );
    }
} );

app.post( '/api/ar/placeArObject', function( req, res, next ) {
  console.log( ' got the placeArObject Post' );
  var sessionId = socketServer.sessionid;
  var data = 'foo'
  socketServer.emit( 'placeArObject', data, sessionId );
  res.json( { message: 'got it' } );

} );

//
// Experiment with the obliquevision spatial data server (COSAAR)
//
// Centroid of house

var cosaarQueryParms = {
  lon: -71.609117,
  lat: 42.622,
  radius: 1000
};

var cosaarQueryString = '&lon=' + cosaarQueryParms.lon + '&radius=' +
  cosaarQueryParms.radius + '&lat=' + cosaarQueryParms.lat;

var cosaarOptions = {
  host: 'obliquevision.org',
  path: '/cosaar/web/porpoise.php?layerName=context1&userId=400785_berlinwall' +
   cosaarQueryString
};

app.get( '/cosaar', function( req, res ) {

cb = function( response ) {
  var str = '';
  response.on( 'data', function( chunk ) {
    str += chunk;
  } );
  response.on( 'end', function() {
    var arObjectsCore = JSON.parse( str );

   // var cosaarImg = JSON.stringify(arObjectsCore.hotspots[1].imageURL)

  res.render( 'cosaar', arObjectsCore );
  } );
};
http.request( cosaarOptions, cb ).end();
 } );

app.get( '/about', function( req, res ) {
   res.render( 'about' );
} );

var port = process.env.PORT || 8080;

// var webServer = app.listen(process.env.port || 8080);

var webServer = app.listen( port );

//console.log( 'Listening on port ' + port );

// Start Socket.io so it attaches itself to Express server
/*jshint -W079 */
var socketServer = socketIO.listen( webServer );
/*jshint +W079 */

socketServer.set( 'log level', 1 );

// "Bus" Communication
//socketServer.sockets.on( 'connection', function( client ) {

socketServer.on( 'connection', function( client ) {

  client.on( 'arDynamicLoadModel', function( data, session ) {
    //client.emit( 'utility', data );
    client.broadcast.emit( 'arDynamicLoadModel', data );
  } );

  client.on( 'utility', function( data, session ) {
    //client.emit( 'utility', data );
    client.broadcast.emit( 'utility', data );
  } );

  client.on( 'videoMute', function( data, session ) {
   // client.emit( 'videoMute', data );
    client.broadcast.emit( 'videoMute', data );
  } );

  client.on( 'focus', function( data, session ) {
    //client.emit( 'focus', data );
   client.broadcast.emit( 'focus', data );
  } );

  client.on( 'message', function( data, session ) {
    //client.emit( 'focus', data );
   client.broadcast.emit( 'message', data );
  } );

// the orientation of the device
//  used to broadcast to peers from the focus

  client.on( 'arOrientation', function( data, session ) {
    client.broadcast.emit( 'arOrientation', data );
  } );

  client.on( 'vrOrientation', function( data, session ) {
    client.broadcast.emit( 'vrOrientation', data );
  } );

  client.on( 'userContext', function( data, session ) {
    client.broadcast.emit( 'userContext', data );
  }
    );

  client.on( 'arObjectShare', function( data, session ) {
   // client.emit( 'arObjectShare ', data );
    client.broadcast.emit( 'arObjectShare', data );
  } );

// set an IOT device

  client.on( 'iotControl', function( data, session ) {
  // client.emit( 'iotState ', data );
   console.log( 'server iotControl broadcast:', data );
    client.broadcast.emit( 'iotControl', data );
  } );

client.on( 'leapShare', function( data, session ) {
   // client.emit( 'arObjectShare ', data );
    client.broadcast.emit( 'leapShare', data );
  } );

client.on( 'leapSphere', function( data, session ) {
   // client.emit( 'arObjectShare ', data );
   client.broadcast.emit( 'leapSphere', data );
  } );

client.on( 'peerSphere', function( data, session ) {
   // client.emit( 'arObjectShare ', data );
   client.broadcast.emit( 'peerSphere', data );
  } );

  client.on( 'toggleCompass', function( data, session ) {
   // client.emit( 'arObjectShare ', data );
    client.broadcast.emit( 'toggleCompass', data );
  } );

  client.on( 'roomnamerequest', function( data, session ) {
   // client.emit( 'arObjectShare ', data );
   //console.log('SERVER-ROOM:', data );
    client.emit( 'roomnamerequest', room );
  } );

  client.on( 'drawLine', function( data, session ) {

    // build up the colors for  drawing

    if ( !( client.id in clients ) ) {
      clients[client.id] = linecolors[Object.keys( clients ).length];
    }
    data.color = clients[client.id];
    data.client = client.id;
    client.emit( 'drawLine', data );
    client.broadcast.emit( 'drawLine', data );
  } );
} );

