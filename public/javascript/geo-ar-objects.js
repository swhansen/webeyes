function buildTestGeoArData() {
  let size = [ 1.0, 1.0, 1.0 ];
  createGeoArObject( 'chix', 'test-world', 42.622339, -71.609203, size, '#CA4646' );
  createGeoArObject( 'shay', 'test-world', 42.624674, -71.609681, size, '#CA4646' );
  createGeoArObject( 'doug', 'test-world', 42.622166, -71.610383, size, '#CA4646' );
  createGeoArObject( 'back', 'test-world', 42.619630, -71.610078, size, '#CA4646' );
  createGeoArObject( 'circle-center', 'test-world', 42.622234, -71.609695, size, '#CA4646' );
}

function createGeoArObject( objName, arworld, lon, lat, size, color ) {
  var placeArObjMsg = {};
  var orientation = [];
  var loc = [];

  loc = [ lat, lon ];

  placeArObjMsg.creator = 'swhansen';
  placeArObjMsg.publicPrivate = 'public';
  placeArObjMsg.objectName = objName;
  placeArObjMsg.createTime = '';
  placeArObjMsg.arworld = arworld;
  placeArObjMsg.type = 'Point';
  placeArObjMsg.coordinates = loc;
  placeArObjMsg.color = color;
  placeArObjMsg.size = size;
  placeArObjMsg.north = '45.123';
  placeArObjMsg.gimble = orientation;
  placeArObjMsg.scale = '1';
  placeArObjMsg.isVisible = 'true';

  $.post( '/createGeoArObj', placeArObjMsg, function( response, status ) {
    if ( response === objName ) {
      console.log( objName + '  placed in Mongodb' );
    }
  } );
}

function liveCreateGeoArObject( objName ) {
  var placeArObjMsg = {};
  var orientation = [];
  var loc = [];

  function postGeoArObject( position ) {
    loc = [ position.coords.longitude, position.coords.latitude ];

    console.log( 'objName:' + objName );

    console.log( 'Latitude: ' + position.coords.latitude +
                ' Longitude: ' + position.coords.longitude +
                ',  ' + position.coords.accuracy );
    console.log( 'altitude: ' + position.coords.altitude +
                ', ' + position.coords.altitudeAccuracy );

    window.addEventListener( 'deviceorientation', event => {
      orientation[ 0 ] = event.alpha;
      orientation[ 1 ] = event.beta;
      orientation[ 2 ] = event.gamma;
    } );

    placeArObjMsg.creator = 'swhansen';
    placeArObjMsg.publicPrivate = 'public';
    placeArObjMsg.objectName = objName;
    placeArObjMsg.createTime = '';
    placeArObjMsg.arworld = 'test';
    placeArObjMsg.type = 'Point';
    placeArObjMsg.coordinates = loc;
    placeArObjMsg.north = '45.123';
    placeArObjMsg.gimble = orientation;
    placeArObjMsg.scale = '1';
    placeArObjMsg.isVisible = 'true';

    $.post( '/createGeoArObj', placeArObjMsg, function( response, status ) {
      if ( response === objName ) {
        console.log( objName + '  placed in Mongodb' );
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
  navigator.geolocation.getCurrentPosition( postGeoArObject, positionError,
    { enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0 }
  );
}

function getGeoArObjects( origin ) {
  console.log( 'at getGeoArObjects:', origin );
  axios.get( '/api/geoarobjects/?radius=5.0' )
    .then( function( response ) {
      var objs = response.data.message;
      var objParams = {};
      objParams.oLat = origin[ 0 ];
      objParams.oLon = origin[ 1 ];

      _.forEach( objs, function( obj ) {
        objParams.pLon = obj.geometry[0].coordinates[0];
        objParams.pLat = obj.geometry[0].coordinates[1];
        objParams.size = obj.size;
        objParams.color = obj.color;
        objParams.alt = -1.0;
        objParams.creator = obj.creator;
        objParams.name = obj.objectName;
        objParams.world = obj.arworld;

        scene.add( new SpatialObjectFromGeo( objParams ) );
        console.log( 'added spatial object: ', objParams );
      } );
    } )
    .catch( function( error ) {
      console.log( error );
    } );
}
