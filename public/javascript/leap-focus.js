function leapFocus() {

//$( '*' ).filter( function() {
//   return $( this ).css( 'z-index' ) >= 10;
// } ).each( function() {
//   console.log( 'z-index:', $( this ), 'is:', $( this ).css( 'z-index' ) );
// } );

var iotIncrement = new Audio( 'audio/button-19.wav');
var iotLightOn = new Audio( 'audio/button-17.wav');
var iotLightOff = new Audio( 'audio/button-47.wav');

var hueDeviceId = document.createElement('div');
hueDeviceId.style.position = 'absolute';
hueDeviceId.style.backgroundColor = 'gray';
hueDeviceId.style.width = 100;
hueDeviceId.style.height = 100;
hueDeviceId.innerHTML = 'hue IOT- 1';
hueDeviceId.style.top = 50 + 'px';
hueDeviceId.style.left = 20 + 'px';
hueDeviceId.style.fontSize = 'x-large';
hueDeviceId.zIndex = 200;
document.body.appendChild(hueDeviceId);

var iotZoneId = document.createElement('div');
iotZoneId.style.position = 'absolute';
iotZoneId.style.backgroundColor = 'gray';
iotZoneId.style.width = 100;
iotZoneId.style.height = 100;
iotZoneId.innerHTML = 'IOT Zone-1';
iotZoneId.style.top = 20 + 'px';
iotZoneId.style.left = 20 + 'px';
iotZoneId.style.fontSize = 'x-large';
iotZoneId.zIndex = 200;
document.body.appendChild( iotZoneId );

 var leapFull = document.getElementById( 'leapfull' );

    leapFull.style.width      = '100%';
    leapFull.style.height     = '100%';
    leapFull.style.position   = 'absolute';
    leapFull.style.top        = '0px';
    leapFull.style.left       = '0px';
    leapFull.style.zIndex = 10;

    var baseBoneRotation = ( new THREE.Quaternion ).setFromEuler( new THREE.Euler( 0, 0, Math.PI / 2 ) );
    var armMeshes = [];
    var boneMeshes = [];

    var setLightState;
    var inChooseState = false;
    var selectedHueDevice = 1;
    var selectedIotZone = 1;
    var iotZones = 3;
    var firstClick = false;

    var renderer, scene, camera, controls;

    var controller = Leap.loop( { enableGesture:true, background: false }, leapAnimate );

    //controller.connect();

    function emitLeap( data ) {
      var sessionId = socketServer.sessionid;
      socketServer.emit( 'leapShare', JSON.stringify( data ), sessionId );
    }

    function emitLeapSphere( data ) {
      var sessionId = socketServer.sessionid;
      socketServer.emit( 'leapSphere', data, sessionId );
    }

   //   controller.on( 'beforeFrameCreated', function( frameData ) {
 //       emitLeap( frameData ); } );

    function emitIOT( data ) {
        var sessionId = socketServer.sessionid;
      socketServer.emit( 'iotControl', data, sessionId );
    }

    socketServer.on( 'leapSphere', function( data ) {
  //console.log( 'handSphere - data:', data );
    updatePeerSphere( data );
      } );




//
// gross gesture detection
//

    controller.on( 'gesture', function( gesture ) {
      switch ( gesture.type ) {
        case 'screenTap':
          updateIotZone();
          console.log( 'screenTap:', gesture.position );
        break;
        case 'keyTap':
          updateIotZone();
          console.log( 'keyTap:', gesture.position );
        break;
        case 'swipe':
          hueSetAllLightsXY( false );
        break;
      //  case 'circle':
      //   hueSetAllLights( true );
      //  break;
      }
      }
    );

    renderer = new THREE.WebGLRenderer( { canvas: leapfull, alpha: true }  );
    renderer.setClearColor( 0xffffff, 0 );
    renderer.setSize( window.innerWidth, window.innerHeight );

    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 5000 );
    camera.position.set( -500, 500, 500 );

    controls = new THREE.OrbitControls( camera, renderer.domElement );
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
    peerSphere.visible = false;
    scene.add( peerSphere );


// hue IOT device ID text

//  var iotText = 'hue IOT - 1';
//
//  var materialFront = new THREE.MeshBasicMaterial( { color: 0x1565C0 } );
//  var materialSide = new THREE.MeshBasicMaterial( { color: 0x90CAF9 } );
//  var materialArray = [ materialFront, materialSide ];
//
//  var textGeom = new THREE.TextGeometry( iotText,
//  {
//    size: 30, height: 4, curveSegments: 3,
//    font: "helvetiker", weight: "normal", style: "normal",
//    bevelThickness: 1, bevelSize: 2, bevelEnabled: true,
//    material: 0, extrudeMaterial: 1
//  });
//
//  var textMaterial = new THREE.MeshFaceMaterial( materialArray );
//  var hueDeviceText = new THREE.Mesh( textGeom, textMaterial );
//  hueDeviceText.rotation.y = -Math.PI / 4;
//
//  function setIOTText( device, font ) {
//
//   iotText = "hue IOT -" + " " + device;
//
//   materialFront = new THREE.MeshBasicMaterial( { color: 0x1565C0 } );
//   materialSide = new THREE.MeshBasicMaterial( { color: 0x90CAF9 } );
//   materialArray = [ materialFront, materialSide ];
//
//   textGeom = new THREE.TextGeometry( iotText,
//  {
//    size: 30, height: 4, curveSegments: 3,
//    font: "helvetiker", weight: "normal", style: "normal",
//    bevelThickness: 1, bevelSize: 2, bevelEnabled: true,
//    material: 0, extrudeMaterial: 1
//  });

//    textMaterial = new THREE.MeshFaceMaterial( materialArray );
//    hueDeviceText = new THREE.Mesh( textGeom, textMaterial );
//    hueDeviceText.rotation.y = -Math.PI / 4;
//  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }

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

function updateHueText( palmCenter, selectedHueDevice ) {

  hueDeviceId.innerHTML = 'hue IOT - ' + selectedHueDevice;

 // setIOTText( selectedHueDevice );
//  hueDeviceText.position.fromArray( palmCenter );
//  hueDeviceText.translateX( -100.0 );
//  hueDeviceText.translateY( -100.0 );
//  hueDeviceText.translateZ( 50.0 );
//  scene.add( hueDeviceText );
//  hueDeviceText.visible = true;
}

function updateIotZone() {
  selectedIotZone++;
  if ( selectedIotZone === iotZones + 1 ) { selectedIotZone = 1; }
  iotZoneId.innerHTML = 'IOT Zone - ' + selectedIotZone;
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

function updatePeerSphere( data ) {

if ( data.originRtcId !== userContext.rtcId) {

  peerSphere.position.fromArray( data.position );
  peerSphere.material.color = data.color;

//.setRGB(
//            data.color.r,
//            data.color.g,
//            data.color.b );
  peerSphere.visible = data.visible;

  if ( data.setHueState ) {

 var hueXY = getXYPointFromRGB(
              data.color[0],
              data.color[1],
              data.color[2] );

    hueSetLightStateXY( 1, true, [ hueXY.x, hueXY.y ], 100 );
    iotLightOn.play();
  }
 }
}

function updateHandSphere( palmCenter, radius, interactionBox ) {

  handSphere.position.fromArray( palmCenter );

// normalize Leap Palm
// need for RGB color space - threejs wants rgb (0-1)

  var normalizedPalmSphere = interactionBox.normalizePoint( palmCenter, true );

  handSphere.material.color.setRGB(
              normalizedPalmSphere[0],
              normalizedPalmSphere[1],
              normalizedPalmSphere[2] );

  var hueXY = getXYPointFromRGB(
              normalizedPalmSphere[0] * 255,
              normalizedPalmSphere[1] * 255,
              normalizedPalmSphere[2] * 255 );

    if ( setLightState === 'setLight' && inChooseState ) {

        var hueObjData = {};
        hueObjData.deviceID = selectedHueDevice;
        hueObjData.state = true;
        hueObjData.hueXYState = [ hueXY.x, hueXY.y ];
        hueObjData.bri = 100;

    //    console.log( 'at updateHandSphere emitIOT:', hueObjData );

        emitIOT( hueObjData );
        hueSetLightStateXY( selectedHueDevice, true, [ hueXY.x, hueXY.y ], 100 );
        inChooseState = false;
        handSphere.visible = false;
        iotLightOn.play();
          }

    if ( setLightState === 'offLight' && inChooseState ) {
          hueSetLightStateXY( selectedHueDevice, false, [ hueXY.x, hueXY.y ], 100 );
          inChooseState = false;
          handSphere.visible = false;
          iotLightOff.play();
    }

    if ( setLightState === 'adjustLight' ) {
        inChooseState = true;
        handSphere.visible = true;
        scene.add( handSphere );
    }

// broadcast the handSphere for peer intereaction

        var palmSphereData = {};
        palmSphereData.operation = 'move';
        palmSphereData.visible = handSphere.visible;
        palmSphereData.position = palmCenter;
        palmSphereData.color = handSphere.material.color;
        palmSphereData.name = 'handSphere';
        palmSphereData.originRtcId = userContext.rtcId;
        palmSphereData.deviceId = selectedHueDevice;
        emitLeapSphere( palmSphereData );
  }

  function leapAnimate( frame ) {

    var countBones = 0;
    var countArms = 0;

  //  scene.remove( hueDeviceText );
    scene.remove( handSphere );
    armMeshes.forEach( function( item ) { scene.remove( item ); } );
    boneMeshes.forEach( function( item ) { scene.remove( item ); } );

    for ( var hand of frame.hands ) {

      if ( hand.pinchStrength < 0.2 ) { firstClick = true; }

      if ( hand.pinchStrength === 1 && hand.grabStrength < 0.3 ) {

        var pinchFinger = findPinchingFingerType( hand );
          if ( pinchFinger.type === 1 ) {
            if ( firstClick === true ) {
                selectedHueDevice++;
                iotIncrement.play();
                if ( selectedHueDevice > 4 ) { selectedHueDevice = 1; }
            firstClick = false;
          }
        updateHueText( hand.sphereCenter, selectedHueDevice );
      }
    }

      if ( hand.grabStrength > 0.2 && hand.grabStrength < 0.8 ) {
          setLightState = 'adjustLight';
          inChooseState = true;
          updateHandSphere( hand.sphereCenter, hand.sphereRadius, frame.interactionBox );
        }
      if ( hand.grabStrength === 0 && inChooseState) {
          setLightState = 'setLight';
          updateHandSphere( hand.sphereCenter, hand.sphereRadius, frame.interactionBox );
          inChooseState = false;
      }
      if ( hand.grabStrength === 1 && inChooseState) {
          setLightState = 'offLight';
          updateHandSphere( hand.sphereCenter, hand.sphereRadius, frame.interactionBox );
          inChooseState = false;
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

