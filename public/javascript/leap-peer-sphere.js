
//
//
//  Implements Leap Spheres on raw tracking data from socket.io
//

// list the z-factors

// $( '*' ).filter( function() {
//   return $( this ).css( 'z-index' ) >= 10;
// } ).each( function() {
//   console.log( 'z-index:', $( this ), 'is:', $( this ).css( 'z-index' ) );
// } );

// Global Variables for THREE.JS

  var  camera, scene, renderer;

  // Global variable for leap

  var frame;

  // Setting up how big we want the scene to be

  var sceneSize = 100;

  // This is the color and direction
  // of every light we are creating

  var lightArray = [
    [ 0x0F4DA8 , [  1 ,  0 ,  0 ] ],
    [ 0x437DD4 , [ -1 ,  0 ,  0 ] ],
    [ 0x6A94D4 , [  0 ,  1 ,  0 ] ],
    [ 0xFFF040 , [  0 , -1 ,  0 ] ],
    [ 0xBF3330 , [  0 ,  0 ,  1 ] ],
    [ 0xA60400 , [  0 ,  0 , -1 ] ]
  ];

  // The array we will store our finished materials in

  var fingerMaterials = [];

  // We will need a different material for each joint
  // Because we will be using Phong lighting,
  // we will also need a few different properties:

  var fingerMaterialArray = [
  // Diffuse , Specular , Emissive
    [ 0x007AFF , 0x37B6FF , 0x36BBCE ],
    [ 0xFF00FF , 0x3FEFF3 , 0x1FFB75 ],
    [ 0xDCFF55 , 0xAA6B9E , 0xFF6B75 ],
    [ 0xFFAA00 , 0xD0F7F3 , 0xFC8CD5 ],
    [ 0x1078AC , 0x340D0D , 0x5592B1 ],
  ];

  var geometries = [];

  var fingers = [];

// called from focus user through util.js

function initLeapPeerHand() {

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      50 ,
      window.innerWidth / window.innerHeight,
      sceneSize / 100 ,
      sceneSize * 4
    );

    // placing our camera position so it can see everything

    camera.position.z = sceneSize;

    var leapPeerWindow = document.getElementById( 'leappane' );

    leapPeerWindow.style.width      = '100%';
    leapPeerWindow.style.height     = '100%';
    leapPeerWindow.style.position   = 'absolute';
    leapPeerWindow.style.top        = '0px';
    leapPeerWindow.style.left       = '0px';
    leapPeerWindow.style.zIndex = 10;

    //document.body.appendChild( leapPeerWindow );

    // Setting up our  (transparent background )

    renderer = new THREE.WebGLRenderer( { canvas:leapfull, alpha: true } );
//    renderer.setClearColor( 0xffffff, 0 );
    renderer.setSize( window.innerWidth, window.innerHeight );

    window.addEventListener( 'resize', onWindowResize , false );

    initLights();
    initMaterials();
    initGeometry();
    initFingers();
  }

   function initLights(){
    for( var i = 0; i < lightArray.length; i++ ){
      var l = lightArray[i];
      var light = new THREE.DirectionalLight( l[0] , 0.5 );
      light.position.set( l[1][0] , l[1][1]  , l[1][2]  );
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
    for( var i = 0; i < 5; i++ ){
      var size = sceneSize / ( 25  + ( 2 * ( i + 1 ) ));
      var geometry = new THREE.IcosahedronGeometry( size , 2 );

      geometries.push( geometry );
    }
  }

  function initFingers(){

    for( var i = 0 ; i < 10; i++ ){
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

var fingerNameMap = ['thumb', 'index', 'middle', 'ring', 'pinky'];
//var fingerName = fingerNameMap[pointables[i].type];

function update() {

  // var myFrame = new Leap.Frame( frame );
  //console.log('test frame:', myFrame );
  //var myFingers = myFrame.fingers;
  //console.log( 'fingers:', myFingers );
  //console.log( 'fingers-bone-1.center:', myFingers.bones[1].center() );

  var jointList = [ 'carpPosition', 'mcpPosition', 'pipPosition', 'dipPosition', 'stabilizedTipPosition' ];

   for ( fingersIndex = 0; fingersIndex < fingers.length; fingersIndex++ ) {  //big list of fingers

     if ( frame.pointables[ fingersIndex ] ) {  // pointables on a finger exist

       var joints = frame.pointables[ fingersIndex ];  //  leap joint pointables[i]

       _.forEach( jointList, function( jointName, index ) {  // leap - (carpPosition, 0)

           var jointPos = joints[ jointName ];  //array location
           position = leapToScene( jointPos );  // position of leap joint - transformed

           fingers[ fingersIndex ].points[ index ].position.x = position.x;
           fingers[ fingersIndex ].points[ index] .position.y = position.y;
           fingers[ fingersIndex ].points[ index ].position.z = position.z;
         } );
     } else {
       var finger = fingers[ fingersIndex ];
       for( var j = 0; j < finger.points.length; j++ ){
             finger.points[j].position.x = sceneSize * 100;
       }
     }
   }

   renderer.render( scene, camera );

  //  console.log( 'a finger joint', fingers[1].points[1].position );
}

// function animateTrackingData() {
//
//  Simpole line hand using canvas only
//
//
//  leapctx.clearRect(0, 0, leapctx.canvas.width, leapctx.canvas.height);
//
// if (frame.pointables.length > 0) {
//
//   frame.pointables.forEach( function( pointable ) {
//
//    function normalizePosition( pos ) {
//      var norm = [];
//      for ( i = 0; i < pos.length; i++ ) {
//        norm[i] = ( ( pos[i] - lCenter[i] ) / lSize[i] ) + 0.5 ;
//      }
//      return  norm;
//      }
//
//
//   var tipPosition = pointable.stabilizedTipPosition;
//   var dipPosition = pointable.dipPosition;
//   var pipPosition = pointable.pipPosition;
//   var mcpPosition = pointable.mcpPosition;
//   var carpPosition = pointable.carpPosition;
//
//   var lCenter = frame.interactionBox.center;
//   var lSize = frame.interactionBox.size;
//
//   var tipx =  leapctx.canvas.width * normalizePosition( tipPosition )[0];
//   var tipy =  leapctx.canvas.height * ( 1 - normalizePosition( tipPosition )[1]);
//
//
//   var dipx =  leapctx.canvas.width * normalizePosition( dipPosition )[0];
//   var dipy =  leapctx.canvas.height * ( 1 - normalizePosition( dipPosition )[1]);
//
//   var pipx =  leapctx.canvas.width * normalizePosition( pipPosition )[0];
//   var pipy =  leapctx.canvas.height * ( 1 - normalizePosition( pipPosition )[1]);
//
//   var mcpx =  leapctx.canvas.width * normalizePosition( mcpPosition )[0];
//   var mcpy =  leapctx.canvas.height * ( 1 - normalizePosition( mcpPosition )[1]);
//
//   var carpx =  leapctx.canvas.width * normalizePosition( carpPosition )[0];
//   var carpy =  leapctx.canvas.height * ( 1 - normalizePosition( carpPosition )[1]);
//
//   //var normalizedPosition =  normalizePosition( tipPosition );
//   //var x = leapctx.canvas.width * normalizedPosition[0];
//   //var y = leapctx.canvas.height * (1 - normalizedPosition[1]);
//
//   leapctx.beginPath();
//   leapctx.fillStyle = 'red';
//   leapctx.fillRect(tipx, tipy, 4, 4);
//
//   leapctx.fillStyle = 'blue';
//   leapctx.fillRect(dipx, dipy, 6, 6);
//
//   leapctx.fillStyle = 'yellow';
//   leapctx.fillRect(pipx, pipy, 8, 8);
//
//   leapctx.fillStyle = 'green';
//   leapctx.fillRect(mcpx, mcpy, 10, 10);
//
//   leapctx.fillStyle = 'orange';
//   leapctx.fillRect(carpx, carpy, 14, 14 );
//
// leapctx.beginPath();
// leapctx.moveTo(tipx, tipy);
// leapctx.lineTo(dipx, dipy );
// leapctx.lineTo(pipx, pipy );
// leapctx.lineTo(mcpx, mcpy );
// leapctx.lineTo(carpx, carpy );
// leapctx.lineWidth = 15;
// leapctx.strokeStyle = '#FF0000';
// leapctx.stroke();
//
//   } );
// }
// }

  socketServer.on( 'leapShare', function( data ) {
    frame = JSON.parse( data );
//    animateTrackingData();
    update();
    } );

//function animate() {

//    frame = controller.frame();
//    animateTrackingData();
//    update();
//    console.log( 'at animate' );
//    renderer.render( scene, camera );
//    requestAnimationFrame( animate );
// }

  function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }
