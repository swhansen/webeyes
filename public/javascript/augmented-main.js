var arDeviceOrientation = {};
var arSelectObjectArray = [];
var arUserCreatedObject;
var selectedArObject;
var clock = new THREE.Clock();

var isAnimateKnot = false;
var isAnimateSwordGuy = false;
var sheep;
var flyingPig;
var pivotPoint;
var lamp;
var knot;

function getArWorldSummary() {

  // for experimental API

  var sceneChildren = [];
  var child = {};

  scene.children.forEach( function( c ) {
    child = {};
    child.id = c.id;
    child.uuid = c.uuid;
    child.name = c.name;
    child.visible = c.visible;
    child.position = c.position;
    sceneChildren.push( child );
    } );

  var sessionId = socketServer.sessionid;
  socketServer.emit( 'updateArObjects', sceneChildren, sessionId );
}

//
// ----------  Main AR/VR entry point --------------------------
//

function loadAr() {

  console.log( 'loadAr:', userContext.mode );

  if ( userContext.mode === 'ar') {
  orientationCompass( true );
}

  var renderer, projector, arContainer, cameraDriver;
  var sensorDrivenCamera, broadcastDrivenCamera, sensorCameraControls, broadcastCameraControls;
  var vrDrivenCamera, vrBroadcastDrivenCamera, vrDrivenCameraControls, vrBroadcastCameraControls;

  var loader = new THREE.JSONLoader();

  // Build the Dimensional Layer

  //  var $arcanvaspane =  $( '<div>', { id: 'arcanvaspane', class: 'canvascenter' } );
  //  var $arcanvas =  $( '<canvas>', { id: 'arcanvas', class: 'canvasorient' } );
  //  $arcanvaspane.append( $arcanvas );
  //  $( 'body' ).append( $arcanvaspane );
  //  $( '#arcanvas' ).click.off;

  document.getElementById( 'canvaspane' ).style.zIndex = '10';
  document.getElementById( 'arcanvaspane' ).style.zIndex = '50';

  // document.getElementById( 'sticky-ui-container' ).style.zIndex = '50';
  // document.getElementById( 'sticky-ui-container' ).style.display = 'visible';
  setDomPointerEvent( 'canvas0', 'none' );
  setDomPointerEvent( 'arcanvaspane', 'auto' );

  clock.stop();
  clock.start();

  // load the AR world and interaction

  $.when(
    $.getScript( 'javascript/armodels/ar-load-core.js' ),
    $.getScript( 'javascript/setup-ar-interaction.js' ),
    $.getScript( 'javascript/ar-object-communication.js' ),
    $.Deferred( function( deferred ) {
      $( deferred.resolve );
    } )
  ).done( function() {
    setUpArLayer();
    setupArInteractionEvents();
    $( '#ar-radial-menu' ).css( 'visibility', 'visible' );
  } );
}
