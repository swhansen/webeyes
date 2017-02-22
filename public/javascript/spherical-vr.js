//
//  Experimental equirectangular spherical VR
//    - https://github.com/turban/photosphere

function removeSphericalVr() {
  $( '#spherepane' ).css( 'visibility', 'hidden' );
}

function sphericalVr() {

  if ( scene ) {
    scene.children.forEach( function( object ) {
      scene.remove( object );
    } );
}

  var spherePane = document.getElementById( 'spherepane' );
  var sphereCanvas = document.getElementById( 'spherecanvas' );
  spherePane.style.visibility = 'visible';

  var box0Focus = $( '#box0' );
  var boxPosition = box0Focus.offset();
  var boxWidth = box0Focus.outerWidth();
  var boxHeight = box0Focus.outerHeight();

  $( '#spherepane' ).css( boxPosition );
  $( '#spherepane' ).css( 'width', boxWidth );
  $( '#spherepane' ).css( 'height', boxHeight );
  $( '#spherepane' ).css( 'z-index', 200 );
  $( '#spherecanvas' ).css( boxPosition );
  $( '#spherecanvas' ).css( 'width', boxWidth );
  $( '#spherecanvas' ).css( 'height', boxHeight );

  // sphereCanvas.width = spherePane.clientWidth;
  // sphereCanvas.height = spherePane.clientHeight;

  var scene = new THREE.Scene();

  var camera = new THREE.PerspectiveCamera( 75, boxWidth / boxHeight, 1, 1000 );
  camera.position.x = 0.1;

  var renderer = new THREE.WebGLRenderer( { canvas: sphereCanvas } );
  renderer.setSize( boxWidth, boxHeight );

  var sphere = new THREE.Mesh(
      new THREE.SphereGeometry( 100, 20, 20 ),
      new THREE.MeshBasicMaterial( {
        map: THREE.ImageUtils.loadTexture( 'img/3d/bridge.jpg' )
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

  var geometryCube2 = new THREE.BoxGeometry( 0.8, 0.8, 0.8 );
    var material2 = new THREE.MeshPhongMaterial( { color: 'red' } );

    var cube2 = new THREE.Mesh( geometryCube2, material2 );
    cube2.position.set( -2.0, 0.0, -6.0 );
    cube2.rotateZ = 10.00;
    cube2.name = 'cube2';
    cube2.userData.isSelectable = true;
    cube2.userData.isAnimated = false;
    arSelectObjectArray.push( cube2 );
    scene.add( cube2 );

    var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    light.name = 'HemisphereLight';
    scene.add( light );

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

