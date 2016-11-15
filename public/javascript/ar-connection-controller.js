function arConnectionController() {

  socketServer.removeAllListeners( 'arObjectShare' );

//   Set up the camera drivers and connection feed
//   Based on participantState(focus or peer)
//    focus - device sensors
//    peer - broadcast fed sensors
//    ar - sensor driven
//    vr - mouse driven

  if ( userContext.participantState === 'focus' && userContext.mode === 'vr' ) {
    cameraDriver = vrDrivenCamera;
    vrDrivenCamera.lookAt( scene.position );
    connectToVrController();
    socketServer.on( 'arObjectShare', function( data ) {
           receiveArObject( data );
      } );
  }

    if ( userContext.participantState === 'peer' && userContext.mode === 'vr' ) {
      cameraDriver = vrBroadcastDrivenCamera;
      vrBroadcastDrivenCamera.lookAt( scene.position );
      connectToVrBroadcast();
      socketServer.on( 'arObjectShare', function( data ) {
           receiveArObject( data );
      } );
    }

  if ( userContext.participantState === 'focus' && userContext.mode === 'ar' ) {
      cameraDriver = sensorDrivenCamera;
      sensorDrivenCamera.lookAt( scene.position );
      connectToDeviceSensors();
      socketServer.on( 'arObjectShare', function( data ) {
           receiveArObject( data );
      } );
      }

  if ( userContext.participantState === 'peer' && userContext.mode === 'ar' ) {
      cameraDriver = broadcastDrivenCamera;
      broadcastDrivenCamera.lookAt( scene.position );
      connectToBroadcastSensors();
      socketServer.on( 'arObjectShare', function( data ) {
           receiveArObject( data );
        } );
      }
}

// end  arConnectionController
