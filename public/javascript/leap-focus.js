function leapFocus() {

//$( '*' ).filter( function() {
//   return $( this ).css( 'z-index' ) >= 10;
// } ).each( function() {
//   console.log( 'z-index:', $( this ), 'is:', $( this ).css( 'z-index' ) );
// } );


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
    var selectedHueDevice = 0;
    var firstClick = false;

    var renderer, scene, camera, controls;

    var controller = Leap.loop( { enableGesture:true, background: false }, leapAnimate );

    //controller.connect();

    function emitLeap( data ) {
      var sessionId = socketServer.sessionid;
        socketServer.emit( 'leapShare', JSON.stringify( data ), sessionId );
      }

   //   controller.on( 'beforeFrameCreated', function( frameData ) {
 //       emitLeap ( frameData ); } );

//
// gesture detection for hue
//

    controller.on( 'gesture', function( gesture ) {
      switch ( gesture.type ) {
        case 'screenTap':
      //  hueSetLightState( 1, true );
        break;
        case 'swipe':
     //     hueSetAllLights( false );
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

// hue IOT device ID text

  var iotText = 'hue IOT - 1';

  var materialFront = new THREE.MeshBasicMaterial( { color: 0x1565C0 } );
  var materialSide = new THREE.MeshBasicMaterial( { color: 0x90CAF9 } );
  var materialArray = [ materialFront, materialSide ];

  var textGeom = new THREE.TextGeometry( iotText,
  {
    size: 30, height: 4, curveSegments: 3,
    font: "helvetiker", weight: "bold", style: "normal",
    bevelThickness: 1, bevelSize: 2, bevelEnabled: true,
    material: 0, extrudeMaterial: 1
  });

  var textMaterial = new THREE.MeshFaceMaterial( materialArray );
  var hueDeviceText = new THREE.Mesh( textGeom, textMaterial );
  hueDeviceText.rotation.y = -Math.PI / 4;

function setIOTText( device ) {

   iotText = "hue IOT - " + device;

   materialFront = new THREE.MeshBasicMaterial( { color: 0x1565C0 } );
   materialSide = new THREE.MeshBasicMaterial( { color: 0x90CAF9 } );
   materialArray = [ materialFront, materialSide ];

   textGeom = new THREE.TextGeometry( iotText,
  {
    size: 30, height: 4, curveSegments: 3,
    font: "helvetiker", weight: "bold", style: "normal",
    bevelThickness: 1, bevelSize: 2, bevelEnabled: true,
    material: 0, extrudeMaterial: 1
  });

  textMaterial = new THREE.MeshFaceMaterial( materialArray );
  hueDeviceText = new THREE.Mesh( textGeom, textMaterial );
  hueDeviceText.rotation.y = -Math.PI / 4;
}

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

  function emitIOT( data ) {
    var sessionId = socketServer.sessionid;
    socketServer.emit( 'iotState', data, sessionId );
  }

function updateHueText( palmCenter, selectedHueDevice ) {

  setIOTText( selectedHueDevice );

  hueDeviceText.position.fromArray( palmCenter );
  hueDeviceText.translateX( -100.0 );
  hueDeviceText.translateY( -100.0 );
  hueDeviceText.translateZ( 50.0 );
  scene.add( hueDeviceText );
  hueDeviceText.visible = true;
}

function findPinchingFingerType( hand ){
    var pincher;
    var closest = 500;
    for(var f = 1; f < 5; f++)
    {
        current = hand.fingers[f];
        distance = Leap.vec3.distance(hand.thumb.tipPosition, current.tipPosition);
        if(current != hand.thumb && distance < closest)
        {
            closest = distance;
            pincher = current;
        }
    }
    return pincher;
}

function updateHandSphere( palmCenter, radius, interactionBox ) {

  handSphere.position.fromArray( palmCenter );

// normalize Leap Palm
// need for RGB color space - threejs wants rgb (0-1)

  var normalizedSphere = interactionBox.normalizePoint( palmCenter, true );
  var normalizedPalm = interactionBox.normalizePoint( palmCenter, true );

  handSphere.material.color.setRGB(
              normalizedSphere[0],
              normalizedSphere[1],
              normalizedSphere[2] );

  var hueXY = getXYPointFromRGB(
              normalizedPalm[0] * 255,
              normalizedPalm[1] * 255,
              normalizedPalm[2] * 255 );

    if ( setLightState === 'setLight' && inChooseState ) {
        hueSetLightStateXY( selectedHueDevice, true, [ hueXY.x, hueXY.y ], 100 );
        inChooseState = false;
        handSphere.visible = false;
    }

    if ( setLightState === 'offLight' && inChooseState ) {
       hueSetLightStateXY( selectedHueDevice, false, [ hueXY.x, hueXY.y ], 100 );
       inChooseState = false;
       handSphere.visible = false;
    }

    if ( setLightState === 'adjustLight' ) {
      inChooseState = true;
      handSphere.visible = true;
      scene.add( handSphere );
    }
  }

  function leapAnimate( frame ) {

    var countBones = 0;
    var countArms = 0;

    scene.remove( handSphere );
    scene.remove( hueDeviceText );
    armMeshes.forEach( function( item ) { scene.remove( item ); } );
    boneMeshes.forEach( function( item ) { scene.remove( item ); } );

    for ( var hand of frame.hands ) {

//
//  Logic for hue pinch grab-relase interaction
//

      if ( hand.pinchStrength < 0.2 ) { firstClick = true; }

      if ( hand.pinchStrength == 1 && hand.grabStrength < 0.3 ) {

        var pinchFinger = findPinchingFingerType( hand );
          if ( pinchFinger.type == 1 ) {
            if ( firstClick === true ) {
                selectedHueDevice++;
                if ( selectedHueDevice > 4 ) { selectedHueDevice = 1; }
            console.log( 'selectedHueDevice:', selectedHueDevice, firstClick );
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
      if ( hand.grabStrength == 0 ) {
          setLightState = 'setLight';
          updateHandSphere( hand.sphereCenter, hand.sphereRadius, frame.interactionBox );
      }
      if ( hand.grabStrength == 1 ) {
          setLightState = 'offLight';
          updateHandSphere( hand.sphereCenter, hand.sphereRadius, frame.interactionBox );
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

