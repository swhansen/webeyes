
'use strict';

var bodyParser  = require( 'body-parser' );
var express     = require( 'express' );
var app         = express();
var socketIO    = require( 'socket.io' );
var rtc         = require( 'easyrtc' );
var mongoose    = require( 'mongoose' );
var cors        = require( 'cors' );
var http        = require( 'http' );
var bson        = require( 'bson' );
var _           = require( 'lodash' );

var session = {
  sessionId: '',
  sessionStartTime: '',
  sessionEndTime: '',
  sessionParticipants: {}
  };

// Mongoose Schemas

var User        = require( './public/models/users' );
var GeoArObject = require( './public/models/geoarobjects' );


var linecolors = [ 'rgba(255, 0, 0, 1)',
                   'rgba(255, 0, 225, 1)',
                   'rgba(255, 115, 0, 1)',
                   'rgba(0, 0, 225, 1)'
                  ];

function getRandColor( brightness ) {

    // Six levels of brightness from 0 to 5, 0 being the darkest

    var rgb = [ Math.random() * 256, Math.random() * 256, Math.random() * 256 ];
    var mix = [ brightness * 51, brightness * 51, brightness * 51 ];
    var mixedrgb = [ rgb[ 0 ] + mix[ 0 ], rgb[ 1 ] + mix[ 1 ], rgb[ 2 ] + mix[ 2 ] ].map( function( x ) { return Math.round( x / 2.0 ); } );
    return 'rgb( ' + mixedrgb.join( ',' ) + ' )';
}

function getRandomIntInclusive( min, max ) {
  min = Math.ceil( min );
  max = Math.floor( max );
  return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
}

// stuff for user and core managment

// users are the basis for all core, cannel user communication

var drawsockets  = [];
var systemUsers = [];
var newUserData =  {};
var sessions = [];
var cores = [];

function getUserCore( userId ) {
  systemUsers.find( function( u ) {
    if ( u.userId === userId ) {
      return u.coreId;
    }
  } );
  }

  function getUserSession( userId ) {
  systemUsers.forEach( function( u ) {
    if ( u.userId === userId ) {
      return u.sessionId;
    }
  } );
  }

function getUsersinCoreChannel( coreId, sessionId ) {
  let u = [];
  systemUsers.forEach( function( u ) {
    if ( user.sessionId === sessionId && user.coreId === coreId ) {
      u.push( user.userId );
    }
  } );
}

function addNewUser( userid, core, session ) {
  let u = new user( userid, core, session );
 systemUsers.push( u );
 console.log( 'systemUsers:', systemUsers );
}

function user( userId, core, session ) {
  this.userId = userId;
  this.coreId = core;
  this.sessionId = session;
}

var room;

// -----------------------------------------

var isRtcServerUp = false;

var dimensionalLayers = [];
var arObjects = {};
var sessionUserContext = [];

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
app.use( express.static( __dirname + '/views' ) );

console.log( '__dirname:' + __dirname );

app.use( '/bower', express.static( __dirname + '/bower_components' ) );

app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( bodyParser.json() );

var loggedIn = false;
var password = 'weg2rt';

var handlebars = require( 'express-handlebars' )
  .create( {
    defaultLayout: 'main'
  } );

app.engine( 'hbs', handlebars.engine );
app.set( 'view engine', 'hbs' );

// test for tests....

app.use( function( req, res, next ) {
  res.locals.showTests = app.get( 'env' ) !== 'production' &&
    req.query.test === '1';
  next();
} );

//  Main entry point

app.get( '/', function( req, res ) {

  var host = req.get( 'host' );
  var origin = req.get( 'origin' );
  var referer = req.get( 'referer' );

  console.log( 'host, origin, referer:', host, origin, referer );

    newUserData.sessionId = req.query.sessionId;
    newUserData.useriD = req.query.userId;
    newUserData.coreId = req.query.coreId;

    console.log( 'parameters at app.get /:', req.query.userId, req.query.sessionId, req.query.coreId );

// simply log the cores and sessions

    if ( sessions.indexOf( req.query.sessionId )  === -1 ) {
        sessions.push( req.query.sessionId );
        console.log( 'added', req.query.sessionId );
        console.log( sessions );
    } else {
        console.log( 'Sessions already exists' );
    }

    if ( cores.indexOf( req.query.coreId )  === -1 ) {
        cores.push( req.query.coreId );
        console.log( 'added:', req.query.coreId );
        console.log( cores );
    } else {
        console.log( 'Core already exists' );
    }
  console.log( 'cores, sessions:', cores, sessions );

  if ( !isRtcServerUp ) {
    isRtcServerUp = true;
    var easyrtcServer = rtc.listen(
            app,
            socketServer,
            { 'apiEnable': 'true' }
          );
    }

  if ( !loggedIn ) {
    loggedIn = true;
    res.sendFile( __dirname + '/views/static-multiparty.html' );

  //  var easyrtcServer = rtc.listen(
  //          app,
  //          socketServer,
  //          { 'apiEnable': 'true' }
  //        );
}
  if ( loggedIn === true ) {
    res.sendFile( __dirname + '/views/static-multiparty.html' );

//    } else {

//    res.render( 'entry' );

    }
  } );

//Respond to POST from login form
app.post( '/', function( req, res ) {
  if ( loggedIn === true ) {
    console.log( 'app.post Login data:' + JSON.stringify( req.body ) );
    console.log( 'at app.post logged:true' );
    res.send( 'Already logged in.' );
  } else {
    if ( req.body.password === password ) {
      console.log( 'app.post-login: true' + JSON.stringify( req.body ) );
      room = req.body.roomname;
      loggedIn = true;
      res.send( 'logged in' );
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

// Initiate a video call
app.get( '/video', function( req, res ) {
  if ( loggedIn === true ) {
    res.sendfile( __dirname + '/views/static-multiparty.html' );
  } else {
    res.send( 'Please try later.' );
  }
} );

// -------------------

mongoose.connect( mongoUriString, function( err ) {
  if ( err ) {
  console.log( 'ERROR connecting to:' + mongoUriString + '. '  + err );
  } else {
  console.log ( 'Succeeded connecting to: ' + mongoUriString );
  }
} );



// Mongoose Schemas

var User        = require( './public/models/users' );
var GeoArObject = require( './public/models/geoarobjects' );

//
// Save a geo AR object to Mongo
//  - conforms to geoJson
//

app.post( '/dropArObj', function( req, res ) {

    console.log( 'at dropARObj-stringify req.body: ' + JSON.stringify( req.body ) );
//    console.log( 'at dropARObj- req.body.arObjName string:' + req.body.objectName );
    console.log( 'at dropARObj- req.body.gimble: ' + req.body.gimble );
//    console.log( 'at dropARObj- req.body.coordinates:' + req.body.coordinates );

  var newArObj = new GeoArObject( {
    creator: req.body.creator,
    publicPrivate: req.body.publicPrivate,
    arworld: req.body.arworld,
    objectName: req.body.objectName,
    geometry: {
      type: req.body.type,
      coordinates: req.body.coordinates
    },
    north:  req.body.north,
    gimble:  req.body.gimble,
    scale:   req.body.scale,
    isVisible: req.body.isVisible
  } );

 // newArObj.geometry[0].coordinates = req.body.coordinates;
 // newArObj.geometry[0].type = req.body.type;
 // newArObj.objectName = req.body.objectName;

//  console.log( newArObj.objectName );
  console.log( newArObj.geometry[0].coordinates );
//  console.log( newArObj.geometry[0].type );
//  console.log( JSON.stringify( newArObj ) );

  newArObj.save( function( err ) {
    if ( err ) { return console.log( err ); }

    console.log( 'Geo AR Object ' + newArObj.objectName + ' saved successfully!' );

    res.send( req.body.objectName );

      } );
} );

app.get ( '/api/geoarobjects/', function( req, res ) {

  // calculates radius of search

let searchRadius = req.query.radius / 3963.2;

 var query =  GeoArObject.find(
      { geometry:{ $geoWithin:{ $centerSphere:[ [ -71.6090909, 42.622015 ], searchRadius ] } },
       creator: 'swhansen' } );

 query.exec( function( err, docs ) {
        if ( err ) {
            throw Error;
        }
        res.json( { message: docs } );
    } );
} );

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
//  User Based API

app.get( '/api', function( req, res ) {
    res.json( { message: 'Welcome to the WebEyes API!' } );
} );

//  User Based API

app.get( '/api/user', function( req, res ) {

  var queryObject = {};
    for ( var key in req.query ) {
        queryObject[ key ] = req.query[ key ];
    }
    User.find( queryObject, function( err, docs ) {
            if ( err ) {
                throw Error;
            }
            res.json( { message: docs } );
        } );
    }
);

app.get( '/api/user/:lastName', function( req, res ) {
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

app.post( '/api/user', function( req, res ) {
  var user = new User();
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.email = req.body.email;
  user.userName = req.body.userName;
  user.org = req.body.org;
  user.password = req.body.password;
  user.phone = req.body.phone;
  user.userStatus = req.body.userStatus;

  user.save( function( err ) {
    if ( err ) {
      res.send( err );
    }
    res.json( { message: 'user created' } );
  } );
} );

app.delete( '/api/user/:user_id', function( req, res ) {
        User.remove( { _id: req.params.user_id },
             function( err, user ) {
            if ( err )
                res.send( err );
            res.json( { message: 'Successfully deleted' } );
        } );
    } );

//
//  AR/VR Based API
//

app.get( '/api/ar/getArObjects', function( req, res ) {
  console.log( 'GET arObjects', dimensionalLayers );
  res.json( { message: arObjects } );
} );

app.post( '/api/ar/addNewArObject', function( req, res, next ) {
  console.log( ' got the placeArObject Post' );
  var sessionId = socketServer.sessionid;
  var data = {};
  data.object = req.body.object;
  data.name = req.body.name;
  data.color = req.body.color;
  data.x = req.body.locX;
  data.y = req.body.locY;
  data.z = req.body.locZ;
  socketServer.sockets.emit( 'addNewArObject', data, sessionId );
  res.json( { message: 'newArObject Created: ' + data.x + ' ' + data.y + ' ' + data.z } );
} );

//
//  System Based API
//

app.get( '/api/system/getDimensionalLayers', function( req, res ) {
  console.log( ' GET dimensionalLayers', dimensionalLayers );
  res.json( { message: dimensionalLayers } );
} );

app.get( '/api/system/getChannelUserContext', function( req, res ) {
  res.json( { message: sessionUserContext } );
  } );

//
// Experiment with the obliquevision spatial data server (COSAAR)
//
// Centroid of 55 Wallace Road, Groton Ma

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

  let cb = function( response ) {
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

var webServer = app.listen( port );

// Start Socket.io so it attaches itself to Express server
/*jshint -W079 */
var socketServer = socketIO.listen( webServer );
/*jshint +W079 */

socketServer.set( 'log level', 1 );

var clients = [];
var sids = [];

function findSocketioSessions() {
    let availableSessions = [];
    let rooms = socketServer.sockets.manager.rooms;
    if ( rooms ) {
        for ( var room in rooms ) {
            if ( !rooms[ room ].hasOwnProperty( room ) ) {
                availableSessions.push( room );
            }
        }
    }
    return availableSessions;
}

// "Bus" Communication

socketServer.sockets.on( 'connection', function( socket ) {

  sids.push( socket.id );
  socket.join( newUserData.sessionId );
 // socket.join( newUserData.sessionId );

console.log( 'connection- ' + socket.id + ' connected' );

//console.log( 'test rooms:', socketServer.sockets.sockets( 'session1' ) );
//console.log( 'socketServer rooms:', socketServer.sockets.manager.rooms );

//console.log( 'socketServer rooms:', findSocketioSessions() );

  socket.on( 'newParticipant', function( data, session ) {
      console.log( 'newParticipant-data:', data );
      addNewUser( data.userId, data.coreId, data.sessionId );
    // socket.join( data.sessionId );
    //  console.log( data.sessionId + 'added with socket.join' );
    //  console.log( 'socket.on newParticipant - rooms:', data, findSocketioSessions() );
  } );


  socket.on( 'updateSessionUserContext', function( data, session ) {
    var index = _.findIndex( sessionUserContext, { 'rtcId': data.rtcId } );
      if ( index === -1 ) {
        sessionUserContext.push( data );
      } else {
        if ( index > -1 ) {
          sessionUserContext.splice( index, 1 );
          sessionUserContext.push( data );
        }
      }
  } );

  socket.on( 'updateStatusBox', function( data, session ) {
    socket.broadcast.emit( 'updateStatusBox', data );
  } );

// data now has .sessionId

   socket.on( 'shareImage', function( data, session ) {

      //console.log( 'sockets in session-foo:', socketServer.sockets.to( 'foo' ) );

    console.log( 'shareImage - socket.on:', data.sessionId );
     socketServer.sockets.in( data.sessionId ).emit( 'shareImage', data );


//note:

// socket.to if originator then broadcast else not
//  socket.to( data.sessionId ).emit( 'shareImage', data );


  } );

  socket.on( 'utility', function( data, session ) {
    socketServer.sockets.in( data.sessionId ).emit( 'utility', data, socket.id );
    } );

  socket.on( 'message', function( data, session ) {
    console.log( 'message- socket.on:', data );
    socketServer.sockets.in( data.sessionId ).emit( 'message', data );
  } );

  socket.on( 'videoMute', function( data, session ) {
    socket.broadcast.emit( 'videoMute', data );
  } );

// ------------------------

//?????

 // socket.on( 'updateDimensionalLayers', function( data, session ) {
 //   socket.broadcast.emit( 'arDynamicLoadModel', data );
 // } );


// api

  socket.on( 'updateArObjects', function( data, session ) {
   let arObjects = data;
  } );



  socket.on( 'arDynamicLoadModel', function( data, session ) {

    console.log( 'arDynamicLoadModel:' + this.id + 'sent:' + data );

  socketServer.sockets.in( data.sessionId ).emit( 'arDynamicLoadModel', data, socket.id );

  // socket.to( data.sessionId ).broadcast.emit( 'arDynamicLoadModel', data, socket.id );

//socketServer.sockets.emit( 'arDynamicLoadModel', data, socket.id );

  //socket.to( data.sessionId ).broadcast.emit( 'arDynamicLoadModel', data, socket.id );
 //  socket.broadcast.emit( 'arDynamicLoadModel', data );

  } );



  socket.on( 'focus', function( data, session ) {
   socket.broadcast.emit( 'focus', data );
  } );

//  the orientation of a mobile device
//  used to broadcast to peers from the focus

  socket.on( 'arOrientation', function( data, session ) {

    // socket.broadcast.emit( 'arOrientation', data );

    socketServer.sockets.in( data.sessionId ).emit( 'arOrientation', data );

  } );



  socket.on( 'vrOrientation', function( data, session ) {

  //  socket.broadcast.emit( 'vrOrientation', data );

    socketServer.sockets.in( data.sessionId ).emit( 'vrOrientation', data );

    //socket.broadcast.to( data.sessionId ).emit( 'vrOrientation', data );


  } );

  socket.on( 'userContext', function( data, session ) {

   //  socketServer.sockets.in( data.sessionId ).emit( 'userContext', data );
     socket.broadcast.to( data.sessionId ).emit( 'userContext', data );

   // socket.broadcast.emit( 'userContext', data );
  }
    );

  socket.on( 'arObjectShare', function( data, session ) {

   // socket.broadcast.emit( 'arObjectShare', data );

   console.log( 'arObjectShare:', data );

    socketServer.sockets.in( data.sessionId ).emit( 'arObjectShare', data );
    //  socket.in( data.sessionId ).emit( 'arObjectShare', data );


  } );

// set an IOT device

  socket.on( 'iotControl', function( data, session ) {

 socketServer.sockets.in( data.sessionId ).emit( 'iotControl', data );

   // socket.broadcast.emit( 'iotControl', data );

  } );

socket.on( 'leapShare', function( data, session ) {
  //  socket.broadcast.emit( 'leapShare', data );
    socketServer.sockets.in( data.sessionId ).emit( 'leapShare', data );
  } );

//socket.on( 'leapSphere', function( data, session ) {
//   socket.broadcast.emit( 'leapSphere', data );
//  } );

socket.on( 'peerSphere', function( data, session ) {
  // socket.broadcast.emit( 'peerSphere', data );
   socketServer.sockets.in( data.sessionId ).emit( 'peerSphere', data );
  } );




  socket.on( 'toggleCompass', function( data, session ) {
    socket.broadcast.emit( 'toggleCompass', data );
  } );

  socket.on( 'roomnamerequest', function( data, session ) {
    socket.emit( 'roomnamerequest', newUserData );
  } );

  socket.on( 'drawLine', function( data, session ) {

      // build up the colors for  drawing

      // if ( !( socket.id in drawsockets ) ) {
      //   drawsockets[ socket.id ] = linecolors[ Object.keys( drawsockets ).length];
      // }

     if ( !( socket.id in drawsockets ) ) {
      //drawsockets[ socket.id ] = getRandColor( getRandomIntInclusive( 0, 5 ) );
      drawsockets[ socket.id ] = getRandColor( 5 );
    }

    data.color = drawsockets[ socket.id ];
    data.socket = socket.id;
    socketServer.sockets.in( data.sessionId ).emit( 'drawLine', data );

      // to self
      // socket.emit( 'drawLine', data );
      // only to other
      // socket.broadcast.emit( 'drawLine', data );

  } );
} );

