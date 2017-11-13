
console.log( 'createArObject Loaded' );

function createArObject( objName ) {

  console.log( 'createArObject-objName:' + objName );

//
//  Create an AR object placed by a device
//

var placeArObjMsg = {
    creator: 'ZZ',
    publicPrivate: 'public',
    objectName: objName,
    createTime: '',
    arworld: 'a world',
    geometry: {
      type: 'Point',
      'coordinates': [ -71.609225, 42.622359 ]
    },
    north: '45.123',
    gimble:  [ 20.0, 40.0, 60.0 ],
    scale: '1',
    isVisible: 'true'
};

if ( userContext.geoLocation === true ) {

  navigator.geolocation.getCurrentPosition( function( position ) {
    placeArObjMsg.geometry.coordinates[0] = position.coords.longitude;
    placeArObjMsg.geometry.coordinates[1] = position.coords.latitude;
  } );
  }

if ( userContext.orientation === true ) {
   window.addEventListener( 'deviceorientation', function( event ) {
      placeArObjMsg.gimble[0] = event.beta;
      placeArObjMsg.gimble[1] = event.gamma;
      placeArObjMsg.gimble[2] = event.alpha;
      } );
  }

console.log( 'createArObject:' + placeArObjMsg );

placeArObjMsg.createTime = Math.floor( ( new Date() ).getTime() / 1000 );

console.log( 'createArObject:' + placeArObjMsg );

//var geoObj = placeArObjMsg.serializeObject();;

$.post( '/dropArObj', placeArObjMsg, function( response, status ) {

  console.log( 'geoObj:' + placeArObjMsg );
} );

}

