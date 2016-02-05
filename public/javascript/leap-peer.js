

  var frame;

var lCanvas = document.getElementById( 'leapcanvas' );
 var leapctx = lCanvas.getContext( '2d' );

  document.getElementById( 'leapfull' ).className = 'leapcenter';

  lCanvas.style.width = '100%';
  lCanvas.style.height = '100%';
  lCanvas.width = lCanvas.offsetWidth;
  lCanvas.height = lCanvas.offsetHeight;

// list the z-factors

// $( '*' ).filter( function() {
//   return $( this ).css( 'z-index' ) >= 10;
// } ).each( function() {
//   console.log( 'z-index:', $( this ), 'is:', $( this ).css( 'z-index' ) );
// } );

//  socketServer.on( 'leapShare', function( data ) {
//    //console.log( 'at runLeap-frame:', JSON.parse( data ) );
//    frame = JSON.parse( data );
//    animateTrackingData();
////    update();
//    } );


// Global Variables for THREE.JS

  var container , camera, scene, renderer;

  // Global variable for leap


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
  ];

  var geometries = [];

  var fingers = [];


initLeapPeerHand();
// Start the threejs animation

  animate();

function initLeapPeerHand() {


//  var lCanvas = document.getElementById( 'leapcanvas' );
// var leapctx = lCanvas.getContext( '2d' );
//
//  document.getElementById( 'leapfull' ).className = 'leapcenter';
//
//  lCanvas.style.width = '100%';
//  lCanvas.style.height = '100%';
//  lCanvas.width = lCanvas.offsetWidth;
//  lCanvas.height = lCanvas.offsetHeight;

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
    container.style.zIndex = 10;
   // container.style.backgroundColor = 'transparent';

    document.body.appendChild( container );

    // Setting up our  (transparent background )

    renderer = new THREE.WebGLRenderer( { alpha: true } );
    renderer.setClearColor( 0xffffff, 0 );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    // Making sure our renderer is always the right size
  //   window.addEventListener( 'resize', onWindowResize , false );
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

  initLeapPeerHand();





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


var fingerPositions = [ 'carpPosition', 'mcpPosition', 'pipPosition', 'dipPosition', 'tipPosition' ];

var fingerNameMap = ['thumb', 'index', 'middle', 'ring', 'pinky'];
//var fingerName = fingerNameMap[pointables[i].type];


function update() {

// fingers - three fingers  array[10]
// pointables - leap joints array
// fingerPositions - array og leap joint names



//    _.forEach( fingerPositions, function( position, index ) {  // leap - all the pointables
//
//        console.log( 'position:', index, frame.pointable.position );
//
//    }






  console.log( 'at update');

  if (frame.pointables.length > 0) {  // pointables on a finger exist

    for( var threeFinger = 0; threeFinger < fingers.length; i++ ){   // all the  three fingers -just an array


      for (var i = 0; i < fingerPositions.length; i++) {  // iterate over the leap joint positions

        position = leapToScene( frame.pointable.fingerPositions[i] );  // position of leap joint - transformed


// assign the joint vector to the three fingers

        fingers[threeFinger].points[i].position.x = position.x;
        fingers[threeFinger].points[i].position.y = position.y;
        fingers[threeFinger].points[i].position.z = position.z;

        }
      }
  }

}





// // var leapFinger = pointable;
//   var finger = fingers[0];

//    position = leapToScene( pointable.stabilizedTipPosition );
//  //  console.log( 'position:', position );

//    fingers[0].points[0].position.x = position.x;
//    fingers[0].points[0].position.y = position.y;
//    fingers[0].points[0].position.z = position.z;

//    console.log( 'fingers:', fingers );



function animateTrackingData() {

//var lCanvas = document.getElementById( 'leapcanvas' );
//var leapctx = lCanvas.getContext( '2d' );

// document.getElementById( 'leapfull' ).className = 'leapcenter';

// lCanvas.style.width = '100%';
// lCanvas.style.height = '100%';
// lCanvas.width = lCanvas.offsetWidth;
// lCanvas.height = lCanvas.offsetHeight;

 leapctx.clearRect(0, 0, leapctx.canvas.width, leapctx.canvas.height);

 // frame = JSON.parse( data );

 //console.log( 'frame:', frame );

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
leapctx.lineWidth = 15;
leapctx.strokeStyle = '#FF0000';
leapctx.stroke();

  } );
}
}

function animate() {

  socketServer.on( 'leapShare', function( data ) {
    frame = JSON.parse( data );
    animateTrackingData();
    update();
    } );

//    frame = controller.frame();
//    animateTrackingData();
//    update();
    console.log( 'at animate' );
    renderer.render( scene, camera );
    requestAnimationFrame( animate );
  }
