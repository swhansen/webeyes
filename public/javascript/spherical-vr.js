//
//  Experimental equirectangular spherical VR
//    - https://github.com/turban/photosphere

function removeSphericalVr() {
  $( '#spherepane' ).css( 'visibility', 'hidden' );
}

function sphericalVr( sphereTexture ) {

'use strict';

  userContext.participantState = 'focus';
  userContext.modMeState = true;
  userContext.uiState = 'spherical';
  userContext.mode = 'spherical';
  emitSessionUserContext( userContext );
  setPeerUserContext( 'all', 'mode', 'spherical' );
  setPeerUserContext( 'all', 'participantState', 'peer' );
  userContext.participantState = 'focus';

  emitSessionUserContext( userContext );

   msgString = 'User ' + userContext.rtcId + ' has entered Sphere Mode';
      emitMessage( msgString );

//   if ( scene ) {
//     scene.children.forEach( function( object ) {
//       scene.remove( object );
//     } );
// }

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

  var sphereCamera = new THREE.PerspectiveCamera( 75, boxWidth / boxHeight, 1, 1000 );
  sphereCamera.position.x = 0.01;


  var renderer = new THREE.WebGLRenderer( { canvas: sphereCanvas } );
  renderer.setSize( boxWidth, boxHeight );

  var sphere = new THREE.Mesh(
      new THREE.SphereGeometry( 100, 20, 20 ),
      new THREE.MeshBasicMaterial( {
        map: THREE.ImageUtils.loadTexture( sphereTexture )
      } )
    );
    sphere.scale.x = -1;
    scene.add( sphere );

  var sphereControls = new THREE.OrbitControls( sphereCamera );
  sphereControls.noPan = true;
  sphereControls.noZoom = true;
  sphereControls.autoRotate = true;
  sphereControls.autoRotateSpeed = 0.0;

  function onMouseWheel( event ) {
      event.preventDefault();

      if ( event.wheelDeltaY ) { // WebKit
        sphereCamera.fov -= event.wheelDeltaY * 0.05;
      } else if ( event.wheelDelta ) {  // Opera / IE9
        sphereCamera.fov -= event.wheelDelta * 0.05;
      } else if ( event.detail ) { // Firefox
        sphereCamera.fov += event.detail * 1.0;
      }
      sphereCamera.fov = Math.max( 40, Math.min( 100, sphereCamera.fov ) );
      sphereCamera.updateProjectionMatrix();
    }
    sphereCanvas.addEventListener( 'mousewheel', onMouseWheel, false );
    sphereCanvas.addEventListener( 'DOMMouseScroll', onMouseWheel, false );


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

  function render() {
    sphereControls.update();
    requestAnimationFrame( render );
    renderer.render( scene, sphereCamera );
  }

  render();

}
