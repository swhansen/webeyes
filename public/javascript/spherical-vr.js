
function removeSphericalVr() {
  $( '#sphere' ).remove();
}

function sphericalVr() {

  var spherePane = document.getElementById('sphere');
  var sphereCanvas = document.getElementById( 'spherecanvas' );

  var box0Focus = $( '#box0' );
  var boxPosition = box0Focus.offset();
  var boxWidth = box0Focus.outerWidth();
  var boxHeight = box0Focus.outerHeight();

  $( '#sphere' ).css( boxPosition );
  $( '#sphere' ).css( 'width', boxWidth );
  $( '#sphere' ).css( 'height', boxHeight );
  $( '#sphere' ).css( 'z-index', 200 );
  $( '#spherecanvas' ).css( boxPosition );
  $( '#spherecanvas' ).css( 'width', boxWidth );
  $( '#spherecanvas' ).css( 'height', boxHeight );


  //sphereCanvas.width = spherePane.clientWidth;
 // sphereCanvas.height = spherePane.clientHeight;

  var scene = new THREE.Scene();

  var camera = new THREE.PerspectiveCamera( 75, boxWidth / boxHeight, 1, 1000 );
  camera.position.x = 0.1;

  var renderer = new THREE.WebGLRenderer( { canvas: sphereCanvas } );
  renderer.setSize( boxWidth, boxHeight );

  var sphere = new THREE.Mesh(
      new THREE.SphereGeometry( 100, 20, 20 ),
      new THREE.MeshBasicMaterial( {
        map: THREE.ImageUtils.loadTexture( 'img/spherical.jpg' )
      } )
    );
    sphere.scale.x = -1;
    scene.add( sphere );

  var controls = new THREE.OrbitControls( camera );
  controls.noPan = true;
  controls.noZoom = true;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.0;

  //  controls.rotateLeft(3);
  //  controls.rotateUp(.3);

  spherePane.appendChild( renderer.domElement );

  render();

  function render() {
    controls.update();
    requestAnimationFrame( render );
    renderer.render( scene, camera );
  }

  function onMouseWheel( event ) {
      event.preventDefault();

      if ( event.wheelDeltaY ) { // WebKit
        camera.fov -= event.wheelDeltaY * 0.05;
      } else if ( event.wheelDelta ) {  // Opera / IE9
        camera.fov -= event.wheelDelta * 0.05;
      } else if ( event.detail ) { // Firefox
        camera.fov += event.detail * 1.0;
      }

      camera.fov = Math.max( 40, Math.min( 100, camera.fov ) );
      camera.updateProjectionMatrix();
  }

    document.addEventListener( 'mousewheel', onMouseWheel, false );
    document.addEventListener( 'DOMMouseScroll', onMouseWheel, false );
}

