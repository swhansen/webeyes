
function loadLeap( participantState ) {

  var renderer, scene, camera, controls;

//console.log( 'at setUpLeapLayer' );

// list the z-factors

// $( '*' ).filter( function() {
//   return $( this ).css( 'z-index' ) >= 10;
// } ).each( function() {
//   console.log( 'z-index:', $( this ), 'is:', $( this ).css( 'z-index' ) );
// } );

// tell all peers to initalize leap-recieve and subscribe to the broadcast.


if ( participantState === 'peer' ) {
  leapPeer();
  } else {
   leapFocus();
 }


function leapPeer() {

  var sceneSize = 100;

function initLeap(){

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
      50 ,
      window.innerWidth / window.innerHeight,
      sceneSize / 100 ,
      sceneSize * 4
    );
    // placing our camera position so it can see everything
    camera.position.z = sceneSize;
    // Getting the container in the right location
    container = document.createElement( 'div' );
    container.style.width      = '100%';
    container.style.height     = '100%';
    container.style.position   = 'absolute';
    container.style.top        = '0px';
    container.style.left       = '0px';
    container.style.background = '#000';
    document.body.appendChild( container );
    // Getting the stats in the right position
    stats = new Stats();
    stats.domElement.style.position  = 'absolute';
    stats.domElement.style.bottom    = '0px';
    stats.domElement.style.right     = '0px';
    stats.domElement.style.zIndex    = '999';
    document.body.appendChild( stats.domElement );
    // Setting up our Renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );
    // Making sure our renderer is always the right size
    window.addEventListener( 'resize', onWindowResize , false );
    /*
      INITIALIZE AWESOMENESS!
    */
    initLights();
    initMaterials();
    initGeometry();
    initFingers();

  }

   function initLights(){
    // We are creating a directional light,
    // coloring and placing it according to the light array
    for( var i = 0; i < lightArray.length; i++ ){
      // The parameters for the light
      var l = lightArray[i];
      // Creating the light
      var light = new THREE.DirectionalLight( l[0] , 0.5 );
      light.position.set( l[1][0] , l[1][1]  , l[1][2]  );
      // Making sure that the light is part of
      // Whats getting rendered
      scene.add( light );
    }
  }
  // Creates the proper materials to use for creating the fingers
  function initMaterials(){
    for( var i = 0; i < fingerMaterialArray.length; i++ ){
      var fM = fingerMaterialArray[i];
      // Uses the parts of the finger material array to assign
      // an aesthetic material
      var material = new THREE.MeshPhongMaterial({
        color:                 fM[0],
        specular:              fM[1],
        emissive:              fM[2],
        shininess:                10,
        shading:    THREE.FlatShading
      });
      fingerMaterials.push( material );
    }
  }
  // Creates all the geometries we want,
  // In this case, spheres that get slightly smaller
  // as they get closer to the tip
  function initGeometry(){
    for( var i = 0; i < 4; i++ ){
      var size = sceneSize / ( 20  + ( 2 * ( i + 1 ) ));
      var geometry = new THREE.IcosahedronGeometry( size , 2 );

      geometries.push( geometry );
    }
  }

  function initFingers(){
    // Creating dramatically more finger points than needed
    // just in case 4 hands are in the field
    for( var i = 0 ; i < 20; i++ ){
      var finger = {};
      finger.points = [];
      for( var j = 0; j < geometries.length; j++ ){
        var geo = new THREE.Mesh( geometries[j] , fingerMaterials[j] );
        finger.points.push( geo );
        scene.add( geo );
      }
      fingers.push( finger );
    }
  }



function leapToScene( position ){
    var x = position[0] - frame.interactionBox.center[0];
    var y = position[1] - frame.interactionBox.center[1];
    var z = position[2] - frame.interactionBox.center[2];

    x /= frame.interactionBox.size[0];
    y /= frame.interactionBox.size[1];
    z /= frame.interactionBox.size[2];
    x *= sceneSize;
    y *= sceneSize;
    z *= sceneSize;
    z -= sceneSize;
    return new THREE.Vector3( x , y , z );
  }



  socketServer.on( 'leapShare', function( data ) {
    //console.log( 'at runLeap-frame:', JSON.parse( data ) );
    leapAnimate( data );
    } );



function leapAnimate( data ) {

 var lCanvas = document.getElementById( 'leapcanvas' );
 var leapctx = lCanvas.getContext( '2d' );

document.getElementById( 'leapfull' ).className = 'leapcenter';

  lCanvas.style.width = '100%';
  lCanvas.style.height = '100%';
  lCanvas.width = lCanvas.offsetWidth;
  lCanvas.height = lCanvas.offsetHeight;

 leapctx.clearRect(0, 0, leapctx.canvas.width, leapctx.canvas.height);

  frame = JSON.parse( data );

 console.log( 'frame:', frame );

if (frame.pointables.length > 0) {

  frame.pointables.forEach( function( pointable ) {

   function normalizePosition( pos ) {
     var norm = [];
     for ( i = 0; i < pos.length; i++ ) {
       norm[i] = ( ( pos[i] - lCenter[i] ) / lSize[i] ) + 0.5 ;
     }
     return  norm;
     }

  var tipPosition = pointable.stabilizedTipPosition;
  var dipPosition = pointable.dipPosition;
  var pipPosition = pointable.pipPosition;
  var mcpPosition = pointable.mcpPosition;
  var carpPosition = pointable.carpPosition;

  var lCenter = frame.interactionBox.center;
  var lSize = frame.interactionBox.size;

  var tipx =  leapctx.canvas.width * normalizePosition( tipPosition )[0];
  var tipy =  leapctx.canvas.height * ( 1 - normalizePosition( tipPosition )[1]);


  var dipx =  leapctx.canvas.width * normalizePosition( dipPosition )[0];
  var dipy =  leapctx.canvas.height * ( 1 - normalizePosition( dipPosition )[1]);

  var pipx =  leapctx.canvas.width * normalizePosition( pipPosition )[0];
  var pipy =  leapctx.canvas.height * ( 1 - normalizePosition( pipPosition )[1]);

  var mcpx =  leapctx.canvas.width * normalizePosition( mcpPosition )[0];
  var mcpy =  leapctx.canvas.height * ( 1 - normalizePosition( mcpPosition )[1]);

  var carpx =  leapctx.canvas.width * normalizePosition( carpPosition )[0];
  var carpy =  leapctx.canvas.height * ( 1 - normalizePosition( carpPosition )[1]);

  //var normalizedPosition =  normalizePosition( tipPosition );
  //var x = leapctx.canvas.width * normalizedPosition[0];
  //var y = leapctx.canvas.height * (1 - normalizedPosition[1]);

  leapctx.beginPath();
  leapctx.fillStyle = 'red';
  leapctx.fillRect(tipx, tipy, 4, 4);

  leapctx.fillStyle = 'blue';
  leapctx.fillRect(dipx, dipy, 6, 6);

  leapctx.fillStyle = 'yellow';
  leapctx.fillRect(pipx, pipy, 8, 8);

  leapctx.fillStyle = 'green';
  leapctx.fillRect(mcpx, mcpy, 10, 10);

  leapctx.fillStyle = 'orange';
  leapctx.fillRect(carpx, carpy, 14, 14 );

leapctx.beginPath();
leapctx.moveTo(tipx, tipy);
leapctx.lineTo(dipx, dipy );
leapctx.lineTo(pipx, pipy );
leapctx.lineTo(mcpx, mcpy );
leapctx.lineTo(carpx, carpy );

leapctx.strokeStyle = '#FF0000';
leapctx.stroke();

  } );
}

   // for ( var finger of hand.fingers ) {

   //   for ( var bone of finger.bones ) {

   //     if ( countBones++ === 0 ) { continue; }

   //     var boneMesh = boneMeshes [ countBones ] || addMesh( boneMeshes );
   //     updateMesh( bone, boneMesh );
   //   }
   // }

   //  var arm = hand.arm;
   //  var armMesh = armMeshes [ countArms++ ] || addMesh( armMeshes );
   //  updateMesh( arm, armMesh );
   //  armMesh.scale.set( arm.width / 4, arm.width / 2, arm.length );
  // }

  // renderer.render( scene, camera );
  // controls.update();
  }
}


function leapFocus() {

  console.log( ' at leepFocus' );

 var leapfull = document.getElementById( 'leapfull' );

  var baseBoneRotation = ( new THREE.Quaternion ).setFromEuler( new THREE.Euler( 0, 0, Math.PI / 2 ) );
  var armMeshes = [];
  var boneMeshes = [];

  var renderer, scene, camera, controls;

  var controller = Leap.loop( {background: true}, leapAnimate );
  controller.connect();

function emitLeap( data ) {
    var sessionId = socketServer.sessionid;
    socketServer.emit( 'leapShare', JSON.stringify( data ), sessionId );
  }

    controller.on( 'beforeFrameCreated', function( frameData ) { emitLeap (frameData); });

    renderer = new THREE.WebGLRenderer( { canvas: leapfull, alpha: 1, antialias: true, clearColor: 0xffffff }  );
    renderer.setSize( window.innerWidth, window.innerHeight );

camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 5000 );
    camera.position.set( -500, 500, 500 );

    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.maxDistance = 1000;

    scene = new THREE.Scene();

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

  function leapAnimate( frame ) {

 //console.log( 'leapFocus-frame:', frame );

    var countBones = 0;
    var countArms = 0;

    armMeshes.forEach( function( item ) { scene.remove( item ); } );
    boneMeshes.forEach( function( item ) { scene.remove( item ); } );

    for ( var hand of frame.hands ) {


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

}
