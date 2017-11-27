
function createArObject( objName ) {

var placeArObjMsg = {};
var orientation = [];
var loc = [];

//
//  Create an AR object placed by a device
//

function postPosition( position ) {

  loc = [ position.coords.longitude, position.coords.latitude ];

  console.log( 'objName:' + objName );

  console.log( 'Latitude: ' + position.coords.latitude +
                ' Longitude: ' + position.coords.longitude +
                ',  ' + position.coords.accuracy );
  console.log( 'altitude: ' + position.coords.altitude +
                ', ' + position.coords.altitudeAccuracy );

  function handleOrientation( event ) {

     orientation[ 0 ] = event.alpha;
     orientation[ 1 ] = event.beta;
     orientation[ 2 ] = event.gamma;
    }

  if ( window.deviceOrientation ) {
    window.addEventListener( 'deviceorientation', handleOrientation, true );
    } else {
     orientation = [ 1.0, 1.0, 1.0 ];
    }

    placeArObjMsg.creator = 'swhansen';
    placeArObjMsg.publicPrivate = 'public';
    placeArObjMsg.objectName = objName;
    placeArObjMsg.createTime = '';
    placeArObjMsg.arworld = 'test';
    placeArObjMsg.type = 'Point';
    placeArObjMsg.coordinates = loc;
    placeArObjMsg.north = '45.123';
    placeArObjMsg.gimble =  orientation;
    placeArObjMsg.scale = '1';
    placeArObjMsg.isVisible = 'true';

  $.post( '/dropArObj', placeArObjMsg, function( response, status ) {
    if ( response === objName ) {
      console.log( objName + '  placed in Mongodb' );
      return;
    }
  } );
}

function positionError( error ) {
  var errors = {
    1: 'Permission denied',
    2: 'Position unavailable',
    3: 'Request timeout'
  };
  console.log( 'Error: ' + errors[ error.code ] );
}

  var timeoutVal = 10 * 1000 * 1000;
  navigator.geolocation.getCurrentPosition( postPosition, positionError,
    { enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0 }
    );

}
