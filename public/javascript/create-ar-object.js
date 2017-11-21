function createArObject( objName ) {

var placeArObjMsg = {};

//
//  Create an AR object placed by a device
//

function postPosition( position ) {

  var loc = [ position.coords.longitude, position.coords.latitude ];

  console.log( 'objName:' + objName );

  console.log( 'Latitude: ' + position.coords.latitude +
                ' Longitude: ' + position.coords.longitude +
                ',  ' + position.coords.accuracy );
  console.log( 'altitude: ' + position.coords.altitude +
                ', ' + position.coords.altitudeAccuracy );

    placeArObjMsg.creator = 'swhansen';
    placeArObjMsg.publicPrivate = 'public';
    placeArObjMsg.objectName = objName;
    placeArObjMsg.createTime = '';
    placeArObjMsg.arworld = 'a world';
    placeArObjMsg.type = 'Point';
    placeArObjMsg.coordinates = loc;
    placeArObjMsg.north = '45.123';
    placeArObjMsg.gimble =  [ 20.0, 40.0, 60.0 ];
    placeArObjMsg.scale = '1';
    placeArObjMsg.isVisible = 'true';

  $.post( '/dropArObj', placeArObjMsg, function( response, status ) {
    if ( response === objName ) {
      console.log( objName + '  placed in Mongodb' );
      return;
    }
  } );
}

function displayError( error ) {
  var errors = {
    1: 'Permission denied',
    2: 'Position unavailable',
    3: 'Request timeout'
  };
  alert( 'Error: ' + errors[ error.code ] );
}

  var timeoutVal = 10 * 1000 * 1000;
  navigator.geolocation.getCurrentPosition( postPosition, displayError,
    { enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0 }
    );
}