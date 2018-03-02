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

  // for experimental API...

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

function loadAr( world ) {

  console.log( 'loadAr-entry:', world, userContext.mode );

//  if ( userContext.mode === 'ar') {
//  //orientationCompass( true );
//}

  var renderer, projector, arContainer, cameraDriver;
  var sensorDrivenCamera, broadcastDrivenCamera, sensorCameraControls, broadcastCameraControls;
  var vrDrivenCamera, vrBroadcastDrivenCamera, vrDrivenCameraControls, vrBroadcastCameraControls;

  var loader = new THREE.JSONLoader();

  var load = ( function() {
  // Function which returns a function: https://davidwalsh.name/javascript-functions
    function _load( tag ) {
      return function( url ) {
        return new Promise( function( resolve, reject ) {
          var element = document.createElement( tag );
          var parent = 'body';
          var attr = 'src';

          // Important success and error for the promise
          element.onload = function() {
            resolve( url );
          };
          element.onerror = function() {
            reject( url );
          };

          // Need to set different attributes depending on tag type

          switch ( tag ) {
            case 'script':
              element.async = true;
              break;
            case 'link':
              element.type = 'text/css';
              element.rel = 'stylesheet';
              attr = 'href';
              parent = 'head';
          }

          // Inject into document to kick off loading

          element[ attr ] = url;
          document[ parent ].appendChild( element );
        } );
      };
    }
    return {
      css: _load( 'link' ),
      js: _load( 'script' ),
      img: _load( 'img' )
    };
  } )();

  // Build the Dimensional Layer

  //  var $arcanvaspane =  $( '<div>', { id: 'arcanvaspane', class: 'canvascenter' } );
  //  var $arcanvas =  $( '<canvas>', { id: 'arcanvas', class: 'canvasorient' } );
  //  $arcanvaspane.append( $arcanvas );
  //  $( 'body' ).append( $arcanvaspane );
  //  $( '#arcanvas' ).click.off;

  document.getElementById( 'canvaspane' ).style.zIndex = '10';
  document.getElementById( 'arcanvaspane' ).style.zIndex = '50';

  setDomPointerEvent( 'canvas0', 'none' );
  setDomPointerEvent( 'arcanvaspane', 'auto' );

  clock.stop();
  clock.start();

  // load the AR world and interaction

  var worldModel;

  switch ( world ) {
    case 'steve':
      worldModel = 'javascript/armodels/ar-load-core.js';
      break;
    case 'chuck':
      worldModel = 'javascript/armodels/ar-load-core.js';
      break;
    case 'geotest':
      worldModel = 'javascript/armodels/ar-load-geo.js';
      break;
      case 'dollytest':
      worldModel = 'javascript/armodels/dolly-test.js';
      break;
  }

  Promise.all( [
    load.js( worldModel ),
    load.js( 'javascript/ar-interaction-handler.js' ),
    load.js( 'javascript/ar-object-broadcast-handler.js' )

  ] ).then( function() {
    arInteractionEventsHandler();
    $( '#ar-radial-menu' ).css( 'visibility', 'visible' );
    console.log( 'Models and Handlers loaded!');
  } ).catch( function() {
    console.log( 'Oh no, epic failure!' );
  } );

//  $.when(
//    $.getScript( worldModel ),
//    $.getScript( 'javascript/ar-interaction-handler.js' ),
//    $.getScript( 'javascript/ar-object-broadcast-handler.js' ),
//    $.Deferred( function( deferred ) {
//      $( deferred.resolve );
//    } )
//  ).done( function() {
//   // setUpArLayer();
//    arInteractionEventsHandler();
//    $( '#ar-radial-menu' ).css( 'visibility', 'visible' );
//    console.log( 'loadAr-done:', world, userContext.mode );
//  } );

}
