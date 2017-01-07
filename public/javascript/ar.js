var arDeviceOrientation = {};
var arSelectObjectArray = [];
var arUserCreatedObject;
var selectedArObject;
var clock = new THREE.Clock();

var isAnimateKnot = false;
var sheep;
var flyingPig;
var pivotPoint;
var lamp;
var knot;
var mixer;

// for API

function getArWorldSummary() {

  var sceneChildren = [];
  var child = {}

  for ( i = 0; i < scene.children.length; i++ ) {
    child = {};
    child.id = scene.children[i].id;
    child.uuid = scene.children[i].uuid;
    child.name = scene.children[i].name;
    child.visible = scene.children[i].visible;
    child.position = scene.children[i].position;
    sceneChildren[i] = child;
  }
  var sessionId = socketServer.sessionid;
  socketServer.emit( 'updateArObjects', sceneChildren, sessionId );
}

//
// ----------  Main AR/VR entry point --------------------------
//

function loadAr() {

 var scene, renderer, projector, arContainer, cameraDriver;
 var sensorDrivenCamera, broadcastDrivenCamera, sensorCameraControls, broadcastCameraControls ;
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
  document.getElementById( 'sticky-ui-container' ).style.zIndex = '50';
  document.getElementById( 'sticky-ui-container' ).style.display = 'visible';
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
    } );
  }
