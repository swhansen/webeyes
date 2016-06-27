function leapFocus() {

//( '*' ).filter( function() {
//  return $( this ).css( 'z-index' ) >= 10;
//} ).each( function() {
//  console.log( 'z-index:', $( this ), 'is:', $( this ).css( 'z-index' ) );
//} );

var iotIncrement = new Audio( 'audio/button-19.wav');
var iotLightOn = new Audio( 'audio/button-17.wav');
var iotLightOff = new Audio( 'audio/button-47.wav');

 var leapPane = document.getElementById( 'leappane' );
 var leapFull = document.getElementById( 'leapfull' );
 document.getElementById( 'leappane' ).className = 'canvascenter';

 leapFull.style.width = '100%';
 leapFull.style.height = '100%';
 leapFull.width =  leapPane.offsetWidth;
 leapFull.height = leapPane.offsetHeight;

 leapFull.style.visibility = 'visible';
 leapPane.style.visibility = 'visible';

  leapFull.style.zIndex = 15;

    var baseBoneRotation = ( new THREE.Quaternion ).setFromEuler( new THREE.Euler( 0, 0, Math.PI / 2 ) );
    var armMeshes = [];
    var boneMeshes = [];

    var setLightState;
    var selectedHueDevice = 1;
    var iotZones = 3;
    var firstClick = false;
    var peerData = false;

    var handState = {
      inChooseState: false,
      iotSelectEligible: false,
      inPeerState: false
    };

    var renderer, scene, camera, controls;

    var emitIterator = 0;
    var emitInterval = 5;

    var controller = Leap.loop( { enableGesture:true, background: false, loopWhileDisconnected: false },
       leapAnimate ).use('handEntry').on('handFound', function(){ onHandFound(); });

// Emit the Leap data to all the Peers
// - check for existance of hand
// - emit every N sample cycles

    function emitLeap( data ) {
      emitIterator = emitIterator + 1;
      if ( emitIterator === emitInterval ) {
        emitIterator = 0;
        if ( data.hands.length === 0 ) {
          data = 'remove';
          var sessionId = socketServer.sessionid;
          socketServer.emit( 'leapShare', data , sessionId );
        }
          if (data.hands.length !== 0 ) {
          var sessionId = socketServer.sessionid;
          socketServer.emit( 'leapShare', JSON.stringify( data ), sessionId );
        }
      }
    }

    function emitLeapSphere( data ) {
      var sessionId = socketServer.sessionid;
      socketServer.emit( 'leapSphere', data, sessionId );
    }

    controller.on( 'beforeFrameCreated', function( frameData ) {
        emitLeap( frameData );
      }
      );

    function emitIOT( data ) {
        var sessionId = socketServer.sessionid;
      socketServer.emit( 'iotControl', data, sessionId );
    }

    socketServer.on( 'peerSphere', function( data ) {
      updatePeerSphere( data );
      } );

    controller.on( 'gesture', function( gesture ) {
      switch ( gesture.type ) {
        case 'swipe':
          hueSetAllLightsXY( false );
        break;
      }
      }
    );

    renderer = new THREE.WebGLRenderer( { canvas: leapfull, alpha: true }  );
    renderer.setClearColor( 0xffffff, 0 );
    renderer.setSize( box0Width, box0Height );

    camera = new THREE.PerspectiveCamera( 40, leapFull.width / leapFull.height, 1, 5000 );
    camera.position.set( 0, 600, 420 );

    controls = new THREE.OrbitControls( camera, renderer.domElement );
    //controls.enableRotate = false;
    controls.maxDistance = 1000;

    scene = new THREE.Scene();

    var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    var aLight = new THREE.AmbientLight( 0x333333 );
    scene.add( light );
    scene.add( aLight );

    var handGeometry = new THREE.SphereGeometry( 40, 16, 16 );
    var handMaterial = new THREE.MeshLambertMaterial( { color: 'red' } );
    var handSphere = new THREE.Mesh( handGeometry, handMaterial );
    handSphere.name = 'handSphere';

    var peerSphereGeometry = new THREE.SphereGeometry( 40, 16, 16 );
    var peerSphereMaterial = new THREE.MeshLambertMaterial( { color: 'red' } );
    var peerSphere = new THREE.Mesh( peerSphereGeometry, peerSphereMaterial );
    peerSphere.position.set( 0.0, 0.0, 0.0 );
    peerSphere.name = 'peerSphere';

  //  function onWindowResize() {
  //    camera.aspect = box0Width / box0Height;
  //    camera.updateProjectionMatrix();
  //    renderer.setSize( box0Width, box0Height );
  //  }

  function addMesh( meshes ) {
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshNormalMaterial();
    var mesh = new THREE.Mesh( geometry, material );
    meshes.push( mesh );
    return mesh;
  }

  function updateMesh( bone, mesh ) {
    mesh.position.fromArray( bone.center() );
    mesh.setRotationFromMatrix( ( new THREE.Matrix4 ).fromArray( bone.matrix() ) );
    mesh.quaternion.multiply( baseBoneRotation );
    mesh.scale.set( bone.width, bone.width, bone.length );
    scene.add( mesh );
  }

function updateHueText( selectedHueDevice ) {
  var val = 'IOT Device:' + selectedHueDevice;
  $( '#iotDeviceId' ).html( val );
}

function findPinchingFingerType( hand ){
    var pincher;
    var closest = 500;
    for( var f = 1; f < 5; f++ )
    {
        current = hand.fingers[f];
        distance = Leap.vec3.distance( hand.thumb.tipPosition, current.tipPosition );
        if( current !== hand.thumb && distance < closest )
        {
            closest = distance;
            pincher = current;
        }
    }
    return pincher;
}

// normalize given position and leap interaction box

function normalizeLeapPoint( position ) {
//  var vec = [];
//    vec[0] = ( position[0] - interactionBox.center[0]) / interactionBox.size[0] + 0.5;
//    vec[1] = ( position[1] - interactionBox.center[1]) / interactionBox.size[1] + 0.5;
//    vec[2] = ( position[2] - interactionBox.center[2]) / interactionBox.size[2] + 0.5;

    var vec = [];
    vec[0] = ( position[0] - 0) / 278.491 + 0.5;
    vec[1] = ( position[1] - 236.7) / 278.491 + 0.5;
    vec[2] = ( position[2] - 0) / 278.491 + 0.5;

// if (clamp) {
//   vec[0] = Math.min(Math.max(vec[0], 0), 1);
//   vec[1] = Math.min(Math.max(vec[1], 0), 1);
//   vec[2] = Math.min(Math.max(vec[2], 0), 1);
// }
  return vec;
}

function updatePeerSphere( data ) {
  console.log( 'peer-sphere recieved from peer', data );

  if ( data.operation === 'mouseDown' ) {
    scene.remove( handSphere );
    handState.inChooseState = false;
    }

  if ( data.operation === 'mouseMove' ) {
    scene.add( peerSphere );
    scene.remove( handSphere );

    peerSphere.position.x = data.position[0];
    peerSphere.position.y = data.position[1];
    peerSphere.position.z = data.position[2];

    peerSphere.material.color = data.color;
    }

  if ( data.operation === 'mouseUp' ) {

console.log( 'focus mouseup', data );

    if ( data.setHueState ) {

      var hueXY = getXYPointFromRGB(
                  data.color[0] * 255,
                  data.color[1] * 255,
                  data.color[2] * 255 );

        hueSetLightStateXY( selectedHueDevice, true, [ hueXY.x, hueXY.y ], 100 );
        iotLightOn.play();

        handState.inChooseState = false;
        handState.iotSelectEligible = false;
        renderer.render( scene, camera );
      }
    scene.remove( peerSphere );
  }
}

function onHandFound() {

//// reset on hand re-entry

 handState.inChooseState = false;  handState.iotSelectEligible = false;
}

function updateHandSphere( data ) {

if ( handState.inChooseState === true ) {
  scene.add( handSphere );
}

  handSphere.position.fromArray( data.position );
  // handSphere.position.x = data[0];
  // handSphere.position.y = data[1];
  // handSphere.position.z = data[2];

// normalize Leap Palm for for RGB color space - threejs wants rgb (0-1)

  var normalizedPalmSphere = normalizeLeapPoint( data.position );

  handSphere.material.color.setRGB(
             normalizedPalmSphere[0],
             normalizedPalmSphere[1],
             normalizedPalmSphere[2] );

    handSphere.material.color.r = normalizedPalmSphere[0];
    handSphere.material.color.g = normalizedPalmSphere[1];
    handSphere.material.color.b = normalizedPalmSphere[2];

    var hueXY = getXYPointFromRGB(
                normalizedPalmSphere[0] * 255,
                normalizedPalmSphere[1] * 255,
                normalizedPalmSphere[2] * 255 );

      if ( data.setLightState === 'setLight' ) {

        var hueObjData = {};
        hueObjData.deviceID = selectedHueDevice;
        hueObjData.state = true;
        hueObjData.hueXYState = [ hueXY.x, hueXY.y ];
        hueObjData.bri = 100;

        emitIOT( hueObjData );
        hueSetLightStateXY( selectedHueDevice, true, [ hueXY.x, hueXY.y ], 100 );
        iotLightOn.play();
          }

    if ( data.setLightState === 'offLight' ) {
          hueSetLightStateXY( selectedHueDevice, false, [ hueXY.x, hueXY.y ], 100 );
          iotLightOff.play();
          scene.remove( peerSphere );
    }

        data.operation = 'move';
        data.inChooseState = handState.inChooseState;
        data.color = handSphere.material.color;
        data.name = 'handSphere';
        data.originRtcId = userContext.rtcId;
        data.deviceId = selectedHueDevice;
        data.source = 'hand';

        emitLeapSphere( data );
}

  function leapAnimate( frame ) {

    var countBones = 0;
    var countArms = 0;
    var sphereData = {};

    armMeshes.forEach( function( item ) { scene.remove( item ); } );
    boneMeshes.forEach( function( item ) { scene.remove( item ); } );

    scene.remove( handSphere );


// if (fame.operation === 'mouseMove' ) {
//
//
// }



// make the hand eligable

 for ( var hand of frame.hands ) {
   if ( hand.grabStrength === 0  && handState.iotSelectEligible === false ) {
       handState.iotSelectEligible = true;
   }

//   move to the choose State from selectEligible on the first grab

      if ( hand.grabStrength > 0.05 && hand.grabStrength < 0.95 &&
          handState.inChooseState === false &&
          handState.iotSelectEligible === true ) {
          handState.inChooseState = true;
          handState.iotSelectEligible = false;
        }
 }

    for ( hand of frame.hands ) {

      sphereData.position = hand.sphereCenter;
      sphereData.sphereRadius = hand.sphereRadius;
      sphereData.source = 'hand';

// increment IOT deviceId with left hand only

if ( hand.type === 'left' ) {

  if ( isIotGrabOn  === true ) {

   //if ( hand.pinchStrength < 0.2 ) { firstClick = true; }
   //if ( hand.pinchStrength === 1 && hand.grabStrength < 0.3 ) {
   //  var pinchFinger = findPinchingFingerType( hand );
   //    if ( pinchFinger.type === 1 ) {
   //      if ( firstClick === true ) {
   //          selectedHueDevice++;
   //          iotIncrement.play();
   //          if ( selectedHueDevice > 4 ) { selectedHueDevice = 1; }
   //      firstClick = false;
   //    }
   //  updateHueText( selectedHueDevice );
   //}

  if ( hand.grabStrength < 0.2 ) { firstClick = true; }
    if ( hand.grabStrength === 1  ) {
       if ( firstClick === true ) {
             selectedHueDevice++;
             iotIncrement.play();
             if ( selectedHueDevice > 4 ) { selectedHueDevice = 1; }
         firstClick = false;
       }
     updateHueText( selectedHueDevice );
   }
  }
}

// control light with right hand only
// three possible hand states

if ( hand.type === 'right' ) {

if ( isIotGrabOn  === true ) {

    if ( handState.inChooseState ) {

      if ( hand.grabStrength > 0.005 && hand.grabStrength < 0.995 ) {
          sphereData.setLightState = 'adjustLight' ;
          updateHandSphere( sphereData );
        }

      if ( hand.grabStrength === 0  ) {
          sphereData.setLightState = 'setLight' ;
          handState.inChooseState = false;
          handState.iotSelectEligible = false;
          updateHandSphere( sphereData );
      }

      if ( hand.grabStrength === 1 ) {
          sphereData.setLightState = 'offLight' ;
          handState.inChooseState = false;
          handState.iotSelectEligible = false;
          updateHandSphere( sphereData );
      }
    }
  }
}
      for ( var finger of hand.fingers ) {
        for ( var bone of finger.bones ) {
          if ( countBones++ === 0 ) { continue; }
          var boneMesh = boneMeshes [ countBones ] || addMesh( boneMeshes );
          updateMesh( bone, boneMesh );
        }
      }

      var arm = hand.arm;
      var armMesh = armMeshes [ countArms++ ] || addMesh( armMeshes );
      updateMesh( arm, armMesh );
      armMesh.scale.set( arm.width / 4, arm.width / 2, arm.length );
    }

    renderer.render( scene, camera );
    controls.update();
  }
}
