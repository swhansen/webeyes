
function initLeap() {




  function LeapExample(exampleID, initCallback, frameCallback) {
    var self = this;
    this.exampleID = exampleID;
    this.initCallback = initCallback;
    this.frameCallback = frameCallback;

    this.serviceConnected = false;
    this.leapConnected = false;
    this.initialized = false;
    this.controller = new Leap.Controller();

    //Initialize example code and set onframe callback
    this.init = function () {
        self.exampleElement = document.getElementById(self.exampleID);
        if (self.initCallback) self.initialized = self.initCallback();
        self.controller.on("frame", self.forwardFrameCallback);
    }

    //Look for a valid frame to see if device is present
    this.frameDetectedCallback = function() {
        if(self.controller.frame(0).valid){
           if (!self.initialized) self.init();
           console.log("Device detected");
           self.leapConnected = true;
           self.exampleElement.style.visibility = "visible";
           window.clearTimeout(self.timeout);
           self.controller.removeListener("frame", self.frameDetectedCallback);
        }
    }

    //Forward frames to example code
    this.forwardFrameCallback = function(){
         if (self.frameCallback) self.frameCallback(self.controller.frame(0));
    }

    //On connection to service, set a timeout to warn if valid frames
    //aren't detected in a reasonable amount of time
    this.controller.on('connect', function () {
        console.log("Service connected");
        serviceConnected = true;
        self.timeout = window.setTimeout(function(){
            console.log("Couldn't detect device");
        }, 500);
        self.controller.on("frame", self.frameDetectedCallback);
    });

    this.controller.on('disconnect', function () {
        console.log("Service disconnected");
        serviceConnected = false;
    });

    this.controller.on('deviceConnected', function () {
        if (!self.initialized) self.init();
        console.log("Device connected");
        self.leapConnected = true;
        self.exampleElement.style.visibility = "visible";
    });

    this.controller.on('deviceDisconnected', function () {
        console.log("Device disconnected");
        self.leapConnected = false;
        self.exampleElement.style.visibility = "hidden";
    });

    this.controller.connect();
}

//Example example that uses the LeapExample class:

var exampleInit = function () {
    console.log("Init called")
    return true;
}

var exampleFrame = function (frame) {
    console.log("Frame: " + frame.id + " is " + (frame.valid ? "valid." : "invalid."));
}

var example = new LeapExample("thisLeapExample", exampleInit, exampleFrame);

console.log( 'at setUpLeapLayer' );

// list the z-factors

// $( '*' ).filter( function() {
//   return $( this ).css( 'z-index' ) >= 10;
// } ).each( function() {
//   console.log( 'z-index:', $( this ), 'is:', $( this ).css( 'z-index' ) );
// } );

// If the device is mobile then no physical device - hack

var isInitiator = userContext.isSessionInitiator;
console.log( 'isInitiator:', isInitiator );
console.log( 'userContext...isInitiator:', userContext.isSessionInitiator );

if ( userContext.mobile === false ) {
  runHands();
}

if (userContext.participantState == 'peer') {
  console.log( 'User State is peer' );
}

function runHands() {

 var leapfull = document.getElementById( 'leapfull' );

  var baseBoneRotation = ( new THREE.Quaternion ).setFromEuler( new THREE.Euler( 0, 0, Math.PI / 2 ) );
  var armMeshes = [];
  var boneMeshes = [];

  var renderer, scene, camera, controls;

  //init();
  Leap.loop( {background: true}, leapAnimate ).connect();

  //function init() {

    renderer = new THREE.WebGLRenderer( { canvas: leapfull, alpha: 1, antialias: true, clearColor: 0xffffff }  );
    renderer.setSize( window.innerWidth, window.innerHeight );
  //  document.body.appendChild( renderer.domElement );

    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 5000 );
    camera.position.set( -500, 500, 500 );

    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.maxDistance = 1000;

    scene = new THREE.Scene();

// helpers
  //  var gridHelper = new THREE.GridHelper( 150, 10 );
  //  scene.add( gridHelper );
//
  //  var axisHelper = new THREE.AxisHelper( 150 );
  //  scene.add( axisHelper );

//  var geometry = new THREE.BoxGeometry( 300, 20, 300 );
//  var material = new THREE.MeshNormalMaterial();
//  var mesh = new THREE.Mesh( geometry, material );
//  mesh.position.set( 0, -10, 0 );
//  scene.add( mesh );

//  window.addEventListener( 'resize', onWindowResize, false );

  //}

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



