
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

      /*
       * Put leap-scale Vectors into a unit space
       */
      function normalizeVector(position){
        var pos = new Vector(position[0]/10.0, position[1]/10.0, position[2]/10.0);
         pos.x = (pos.x - LEAP_MIN.x) / (LEAP_MAX.x - LEAP_MIN.x);
         pos.y = (pos.y - LEAP_MIN.y) / (LEAP_MAX.y - LEAP_MIN.y);
         pos.z = (pos.z - LEAP_MIN.z) / (LEAP_MAX.z - LEAP_MIN.z);
         return pos;
      }
    /*
     * Vector Object - mostly for the sake of symantics.
     */
    function Vector(mX,mY,mZ){
      this.x = typeof mX!=='undefined'?mX:0;
      this.y = typeof mY!=='undefined'?mY:0;
      this.z = typeof mZ!=='undefined'?mZ:0;
    }
    Vector.prototype.add = function(v2){
      return new Vector(
        this.x + v2.x,
        this.y + v2.y,
        this.z + v2.z);
    };
    Vector.prototype.subtract = function(v2){
      return new Vector(
        this.x - v2.x,
        this.y - v2.y,
        this.z - v2.z);
    };
    Vector.prototype.multiply = function(v2){
      return new Vector(
        this.x * v2.x,
        this.y * v2.y,
        this.z * v2.z);
    };
    Vector.prototype.multiplyScalar = function(scalar){
      return new Vector(
        this.x * scalar,
        this.y * scalar,
        this.z * scalar);
    };
    Vector.prototype.equals = function(v2){
      return this.x == v2.x && this.y == v2.y && this.z == v2.z;
    };
    Vector.prototype.squaredDistanceTo = function(v2){
      var diff = this.subtract(v2);
      return (diff.x*diff.x)+(diff.y*diff.y)+(diff.z*diff.z);
    };
    Vector.prototype.normalized = function() {
      var mag = this.magnitude();
      return new Vector(
        this.x / mag,
        this.y / mag,
        this.z / mag);
    };
    Vector.prototype.magnitude = function() {
      return Math.sqrt((this.x*this.x)+(this.y*this.y)+(this.z*this.z));
    };
    Vector.prototype.distanceTo = function(v2){
      return Math.sqrt(this.squaredDistance(v2));
    };
    Vector.prototype.dotProduct = function(v2) {
      var v1 = this.normalized();
      v2 = v2.normalized();
      var n = 0;
      n += v1.x * v2.x;
      n += v1.y * v2.y;
      n += v1.z * v2.z;
      return n;
     };

     function leapToVector(leapPosition){
      return new Vector(leapPosition[0], leapPosition[1], leapPosition[2]);
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

  //console.log( 'frame:', frame );

   var countBones = 0;
   var countArms = 0;

   //armMeshes.forEach( function( item ) { scene.remove( item ); } );
   //boneMeshes.forEach( function( item ) { scene.remove( item ); } );

   //for ( var hand of frame.hands ) {

if (frame.pointables.length > 0) {

  frame.pointables.forEach( function( pointable ) {

   function normalizePosition( position ) {
     var pos = new Vector( position[0]/10.0, position[1]/10, position[2]/10 );

        pos.x = (pos.x - LEAP_MIN.x) / (LEAP_MAX.x - LEAP_MIN.x);
         pos.y = (pos.y - LEAP_MIN.y) / (LEAP_MAX.y - LEAP_MIN.y);
         pos.z = (pos.z - LEAP_MIN.z) / (LEAP_MAX.z - LEAP_MIN.z);


   //  for ( i = 0; i < pos.length; i++ ) {
   //    norm[i] = ( ( pos[i] - lCenter[i] ) / lSize[i] ) + 0.5 ;
   //  }
     return  pos;
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
  leapctx.fillRect(carpx, carpy, 14, 14);

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
