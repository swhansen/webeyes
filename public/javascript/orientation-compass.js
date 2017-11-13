
'use strict';

function orientationCompass( data ) {

  emitArOrientationData();

  document.getElementById( 'compassCube' ).style.zIndex = '99';

  //console.log( 'orientationCompass:', data );

  if ( data ) {
    document.getElementById( 'compassCube' ).style.visibility = 'visible';
    } else {
    document.getElementById( 'compassCube' ).style.visibility = 'hidden';
  }

  if ( userContext.participantState === 'focus' ) {
      window.addEventListener( 'deviceorientation', function( event ) {
      document.getElementById( 'compassCube' ).style.webkitTransform =
      document.getElementById( 'compassCube' ).style.transform =
                 'rotateX(' + event.beta + 'deg) ' +
                 'rotateY(' + event.gamma + 'deg) ' +
                 'rotateZ(' + event.alpha + 'deg)';
      }
    );
  }
  if ( userContext.participantState === 'peer' ) {
    socketServer.on( 'arOrientation', function( data ) {
         document.getElementById( 'compassCube' ).style.webkitTransform =
         document.getElementById( 'compassCube' ).style.transform =
                 'rotateX(' + data.beta + 'deg) ' +
                 'rotateY(' + data.gamma + 'deg) ' +
                 'rotateZ(' + data.alpha + 'deg)';
      }
    );
  }
}

function emitArOrientationData() {
//  window.addEventListener( 'orientationchange', function( c ) {
//    arDeviceOrientation.orient = c.orientation || 0;
//  } );

  window.addEventListener( 'deviceorientation', function( event ) {
  let arDeviceOrientation = {};
  arDeviceOrientation.alpha = event.alpha;
  arDeviceOrientation.beta = event.beta; //90.
  arDeviceOrientation.gamma = event.gamma;
  arDeviceOrientation.sessionId = userContext.sessionId;

  var sessionId = socketServer.sessionid;
  socketServer.emit( 'arOrientation', arDeviceOrientation, sessionId );
  } );
}

socketServer.on( 'toggleCompass', function( data ) {
  console.log( 'toggleCompass at orientationCompass:', data );
  orientationCompass( data );
  } );
