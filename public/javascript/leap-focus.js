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
        hueSetLightState( 1, true );
        break;
        case 'swipe':
          hueSetAllLights( false );
        break;
        case 'circle':
         hueSetAllLights( true );
        break;
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

//function updateHue( grabStrength ) {
 // var v = ( grabStrength * 253) + 1;

 // console.log( 'GrabStrength, v:', grabStrength, v);
//  hueSetLightState( 1, true, 65535, v, v );
//}

// function bound( val, min, max ) {
//   if ( val < min ) { return min; }
//   if ( val > max ) { return max; }
// }


function updateHandSphere( palmCenter, radius, interactionBox ) {

  handSphere.position.fromArray( palmCenter );

// normalize Leap Palm Sphere
// need for RGB color space - threejs wants rgb (0-1)

  var normalizedSphere = interactionBox.normalizePoint( palmCenter, true );

  handSphere.material.color.setRGB(
              normalizedSphere[0],
              normalizedSphere[1],
              normalizedSphere[2] );

  var hueXY = getXYPointFromRGB(
              normalizedSphere[0] * 255,
              normalizedSphere[1] * 255,
              normalizedSphere[2] * 255 );

    if ( setLightState === 'setLight' ) {
        hueSetLightStateXY( 1, true, [ hueXY.x, hueXY.y ], 100 );
    }

    if ( setLightState === 'offLight' ) {
       hueSetLightStateXY( 1, false, [ hueXY.x, hueXY.y ], 100 );
       scene.remove( handSphere );
    }

    if ( setLightState === 'adjustLight' ) {
      scene.add( handSphere );
    }


  }

  function leapAnimate( frame ) {

    var countBones = 0;
    var countArms = 0;

    scene.remove( handSphere );
    armMeshes.forEach( function( item ) { scene.remove( item ); } );
    boneMeshes.forEach( function( item ) { scene.remove( item ); } );

    for ( var hand of frame.hands ) {

//
//  Logic for hue grab-relase interaction
//

      if ( hand.grabStrength > 0.3 ) {
          setLightState = 'adjustLight';
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

