function setupArInteractionEvents() {

//
// Establish the user interation with the AR objects
//  - set the cameraDriver based on AR/VR and focus/peer
//

//socketServer.on( 'addNewArObject', function( data ) {
//    arShareData.operation = 'newObject';
//    arShareData.x = data.x;
//    arShareData.y = data.y;
//    arShareData.z = data.z;
//
//    addNewArObjectToWorld( arShareData );
//  } );

var arCanvas = document.getElementById( 'arcanvaspane' );
var ar0 = document.getElementById( 'arcanvas' );

setDomPointerEvent( 'arcanvas', 'auto' );
setDomPointerEvent( 'arcanvaspane', 'auto' );

ar0.style.display = 'visible';
arCanvas.style.display = 'visible';

ar0.style.zIndex = '50';
arCanvas.style.zIndex = '50';

$( '#arcanvas' ).unbind( 'click' );

$( function() {
  $( '#arcanvas' ).click( function( e ) {
      onArSelect( e );
    }
  );
} );

  function emitArObject( data ) {
    data.sessionId = userContext.sessionId;
    var sessionId = socketServer.sessionid;
    console.log( 'emitArObject-arObjectShare:', data );
    socketServer.emit( 'arObjectShare', data, sessionId );
  }

  var arShareData = {};

  var rect = ar0.getBoundingClientRect();
  offsetX = rect.left;
  offsetY = rect.top;

  var viewWidth = ar0.offsetWidth;
  var viewHeight = ar0.offsetHeight;

  projector = new THREE.Projector();

  function toggleArAnimation( arObject ) {
    if ( arObject.userData.isAnimated === false ) {
          arObject.userData.isAnimated = true;
      } else {
        arObject.userData.isAnimated = false;
      }
    }

//
// Place an object with a long click
//

  $( '#arcanvas' ).longpress( function( event ) {

    event.preventDefault();

    var mouse3D = new THREE.Vector3( ( event.clientX - offsetX ) / viewWidth * 2 - 1,
                              -( event.clientY - offsetY ) / viewHeight * 2 + 1, 0.5 );

    mouse3D.unproject( cameraDriver );
    var dir = mouse3D.sub( cameraDriver.position ).normalize();
    var raycaster = new THREE.Raycaster( cameraDriver.position, mouse3D );

    var pos = cameraDriver.position.clone().add( dir.multiplyScalar( 6 ) );

      //  arShareData.operation = 'newObject';
        arShareData.x = pos.x;
        arShareData.y = pos.y;
        arShareData.z = pos.z;

    placeArObjectLongPress( arShareData );

    return false;

    },

  function( e ) {
      return false;
  }, 750 );

function placeArObjectLongPress( data ) {
  swal( {
  title: 'Select an AR Object',
  text: 'it will be placed where you selected',
  input: 'select',
  inputOptions: {
    'torus': 'torus',
    'cube': 'cube'
  },
    inputPlaceholder: 'Select an AR Object',
    showCancelButton: true,
    inputValidator: function( value ) {
    return new Promise( function( resolve, reject ) {
        if ( value === 'torus') {
          resolve();
        } else {
       if (value === 'cube' ) {
        resolve();
      }
        }
    }
    ); }
  } ).then( function( result ) {
    loadArModel( result, data );
  } );
}

  //function addNewArObjectToWorld( d ) {
  //    var materialTorus1 = new THREE.MeshLambertMaterial( { color: 'red' } );
  //    var geometryTorus1 = new THREE.TorusGeometry( 0.3, 0.2, 100, 16 );
  //    var arUserCreatedObject = new THREE.Mesh( geometryTorus1, materialTorus1 );
//
  //    arUserCreatedObject.position.set( d.x, d.y, d.z );
  //    arUserCreatedObject.userData.id = arUserCreatedObject.id;
  //    arUserCreatedObject.name = 'torus';
  //    arUserCreatedObject.userData.objectType =  'torus';
  ////    arUserCreatedObject.name = arUserCreatedObject.id;
  //    arUserCreatedObject.userData.isAnimated = false;
  //    arUserCreatedObject.userData.isUserCreated = true;
  //    arUserCreatedObject.userData.isSelectable = true;
  //    arUserCreatedObject.userData.createdBy = userContext.rtcId;
//
  //    scene.add( arUserCreatedObject );
  //    arSelectObjectArray.push( arUserCreatedObject );
//
  //// push the new object to peers
//
  //    var newArObj = {};
  //    newArObj.operation = 'newObject';
  //    newArObj.x = d.x;
  //    newArObj.y = d.y;
  //    newArObj.z = d.z;
  //    newArObj.color = 'red';
  //    newArObj.id = arUserCreatedObject.id;
  //    newArObj.createdBy = userContext.rtcId;
  //    newArObj.isSelectable = true;
  //    newArObj.isUserCreated = true;
  //    newArObj.objectType = 'torus';
  //    newArObj.name = 'torus';
//
  //    emitArObject( newArObj );
//
  //    getArWorldSummary();
  //  }


// Select an AR object with a single click

 function onArSelect( event ) {

     event.preventDefault();

     var vector = new THREE.Vector3( ( event.clientX - offsetX ) / viewWidth * 2 - 1,
                             -( event.clientY - offsetY ) / viewHeight * 2 + 1, 0.5 );
  //   projector.unprojectVector( vector, cameraDriver );

    vector.unproject( cameraDriver );
    vector.sub( cameraDriver.position );
    vector.normalize();
    var rayCaster = new THREE.Raycaster( cameraDriver.position, vector );
    var intersects = rayCaster.intersectObjects( arSelectObjectArray );
    var selectedObject = intersects[0].object;

     if ( intersects.length > 0 ) {

 // IOT Lights

       if ( selectedObject.userData.isIot === true ) {

         if ( selectedObject.userData.isOn === false ) {
               selectedObject.userData.isOn = true;
               selectedObject.material.opacity = 0.1;
               } else {
               selectedObject.userData.isOn = false;
               selectedObject.material.opacity = 0.5;
             }

         hueSetLightState( selectedObject.userData.iotDeviceId, selectedObject.userData.isOn );

         arShareData.operation = 'toggleIot';
         arShareData.isOn = selectedObject.userData.isOn;
         arShareData.iotDeviceId = selectedObject.userData.iotDeviceId;
         arShareData.arObjectOpacity = selectedObject.material.opacity;
         arShareData.name = selectedObject.name;

         emitArObject( arShareData );
         return;
       }

 // User created objects

   //   if ( selectedObject.userData.isUserCreated === true ) {

   //    if ( selectedObject.userData.isAnimated === false ) {
   //      selectedObject.userData.isAnimated = true;
   //      } else {
   //      selectedObject.userData.isAnimated = false;
   //    }
   //     arShareData.operation = 'animateSelectedObject';
   //     arShareData.id = selectedObject.userData.iotDeviceId;
   //     arShareData.isAnimated = selectedObject.userData.isAnimated;
   //     arShareData.animate = selectedObject.userData.isAnimated;
   //     arShareData.isUserCreated = true;
   //     arShareData.name = 'torus';

   //     emitArObject( arShareData );

   //     return;
   //   }

    // Special Cases - Hardwired by name

     if ( intersects[0].object.name === 'knot' ) {
         isAnimateKnot = !isAnimateKnot;
         animateArObjects();
         return;
     }

    if ( selectedObject.name === 'torus' ) {
        if ( selectedObject.userData.isAnimated === false ) {
          selectedObject.userData.isAnimated = true;
          } else {
          selectedObject.userData.isAnimated = false;
        }

        if ( !selectedObject.userData.isAnimated ) {
         intersects[0].object.material.color.setRGB( Math.random(), Math.random(), Math.random() );
        }

          arShareData.animate = selectedObject.userData.isAnimated;
          arShareData.operation = 'animateSelectedObject';
          arShareData.name = intersects[0].object.name;
          arShareData.x = intersects[0].object.position.x;
          arShareData.y = intersects[0].object.position.y;
          arShareData.z = intersects[0].object.position.z;
          arShareData.position = intersects[0].object.position;
          arShareData.rotation = intersects[0].object.rotation;
          arShareData.color = intersects[0].object.material.color;
          arShareData.isAnimated = selectedObject.userData.isAnimated;

          emitArObject( arShareData );
     }


     if ( selectedObject.name === 'sheep' ) {
        if ( selectedObject.userData.isAnimated === false ) {
          selectedObject.userData.isAnimated = true;
          } else {
          selectedObject.userData.isAnimated = false;
        }

        if ( !selectedObject.userData.isAnimated ) {
         intersects[0].object.material.color.setRGB( Math.random(), Math.random(), Math.random() );
        }

          arShareData.animate = selectedObject.userData.isAnimated;
          arShareData.operation = 'animateSelectedObject';
          arShareData.name = intersects[0].object.name;
          arShareData.x = intersects[0].object.position.x;
          arShareData.y = intersects[0].object.position.y;
          arShareData.z = intersects[0].object.position.z;
          arShareData.position = intersects[0].object.position;
          arShareData.rotation = intersects[0].object.rotation;
          arShareData.color = intersects[0].object.material.color;
          arShareData.isAnimated = selectedObject.userData.isAnimated;

          emitArObject( arShareData );
     }

     if ( selectedObject.name === 'swordGuyMesh' ) {
      if ( selectedObject.userData.isAnimated === false ) {
          selectedObject.userData.isAnimated = true;
          } else {
          selectedObject.userData.isAnimated = false;
        }

       arShareData.operation = 'animateSelectedObject';
       arShareData.animate = selectedObject.userData.isAnimated;
       arShareData.name = intersects[0].object.name;
       arShareData.isAnimated = selectedObject.userData.isAnimated;

       emitArObject( arShareData );
       return;
     }

     if ( selectedObject.name === 'cube2' ) {

      selectedObject.material.color.setRGB( Math.random(), Math.random(), Math.random() );
      selectedObject.position.x += Math.round( Math.random() ) * 2 - 1;
      selectedObject.position.y += Math.round( Math.random() ) * 2 - 1;
      selectedObject.position.z += Math.round( Math.random() ) * 2 - 1;
      selectedObject.rotation.x += Math.random();
      selectedObject.rotation.y += Math.random();
      selectedObject.rotation.z += Math.random();

       arShareData.operation = 'moveObject';
       arShareData.name = intersects[0].object.name;
       arShareData.x = intersects[0].object.position.x;
       arShareData.y = intersects[0].object.position.y;
       arShareData.z = intersects[0].object.position.z;
       arShareData.position = intersects[0].object.position;
       arShareData.rotation = intersects[0].object.rotation;
       arShareData.color = intersects[0].object.material.color;

       emitArObject( arShareData );
       return;
     }
  }
}
}

// Dynamic AR/VR Model Loading --peers

socketServer.on( 'arDynamicLoadModel', function( data, id ) {

console.log( 'socketServer.on(arDynamicLoadModel', data,  id );

if ( data.rtcId === userContext.rtcId ) { return; }

  var pos = {};
  pos.x = data.x;
  pos.y = data.y;
  pos.z = data.z;

   if ( data.modelName === 'iot' ) {
    var filePath =  'javascript/armodels/' + data.file;
      $.when(
        $.getScript( filePath ),
        $.Deferred( function( deferred ) {
        $( deferred.resolve );
        } )
      ).done( function() {
        loadIotAr();
        var modMessage = userContext.rtcId + 'added AR Model' + data.modelName ;
        emitMessage( modMessage );
        messageBar( modMessage );
      } );
    }

    if ( data.modelName === 'swordguy' ) {
    var filePath = 'javascript/armodels/' + data.file;
      $.when(
        $.getScript( filePath ),
        $.Deferred( function( deferred ) {
        $( deferred.resolve );
        } )
      ).done( function() {
        loadSwordGuy();
      } );
    }

    if ( data.modelName === 'sheep' ) {
    var filePath =  'javascript/armodels/' + data.file;
      $.when(
        $.getScript( filePath ),
        $.Deferred( function( deferred ) {
        $( deferred.resolve );
        } )
      ).done( function() {
        loadSheep();
      } );
    }

    if ( data.modelName === 'geometry' ) {

    var filePath =  'javascript/armodels/' + data.file;
      $.when(
        $.getScript( filePath ),
        $.Deferred( function( deferred ) {
        $( deferred.resolve );
        } )
      ).done( function() {
        loadGeometry( data );
      } );
    }

if ( data.modelName === 'torus' ) {

if ( typeof loadTorus === 'function' ) {
  loadTorus( data );
} else {

    let filePath =  'javascript/armodels/' + data.file;
      $.when(
        $.getScript( filePath ),
        $.Deferred( function( deferred ) {
        $( deferred.resolve );
        } )
      ).done( function() {
        loadTorus( data );
        console.log( 'loaded torus' );
      } );
    }
  }

} );

function loadArModel( model, pos ) {

  let data = {};
  data.sessionId = userContext.sessionId;

  console.log( 'at loadArModel:', model, pos );

  if ( typeof pos === 'undefined' ) {
    let pos = {};
    pos.x = -1.0;
    pos.y =  0.5;
    pos.z = -6.0;
  }

  switch ( model ) {
    case 'iot':
    data.file = 'ar-load-iot.js';
    data.modelName = 'iot';
    $.when(
        $.getScript( 'javascript/armodels/ar-load-iot.js' ),
        $.Deferred( function( deferred ) {
        $( deferred.resolve );
        } )
      ).done( function() {
        loadIotAr();
      } );
      var sessionId = socketServer.sessionid;
      socketServer.emit( 'arDynamicLoadModel', data, sessionId );
    break;

    case 'swordguy':
    data.file = 'ar-load-swordguy.js';
    data.modelName = 'swordguy';
    $.when(
        $.getScript( 'javascript/armodels/ar-load-swordguy.js' ),
        $.Deferred( function( deferred ) {
        $( deferred.resolve );
        } )
      ).done( function() {
        loadSwordGuy();
      } );
      var sessionId = socketServer.sessionid;
      socketServer.emit( 'arDynamicLoadModel', data, sessionId );
    break;

    case 'geometry':
      data.file = 'ar-load-geometry.js';
      data.modelName = 'geometry';
      data.x = pos.x;
      data.y = pos.y;
      data.z = pos.z;
      $.when(
        $.getScript( 'javascript/armodels/ar-load-geometry.js' ),
        $.Deferred( function( deferred ) {
        $( deferred.resolve );
        } )
      ).done( function() {
       loadGeometry( pos );
      } );
      var sessionId = socketServer.sessionid;
      socketServer.emit( 'arDynamicLoadModel', data, sessionId );
    break;

    case 'torus':
      data.file = 'ar-load-torus.js';
      data.modelName = 'torus';
      data.x = pos.x;
      data.y = pos.y;
      data.z = pos.z;
      data.rtcId = userContext.rtcId;

       $.getScript( 'javascript/armodels/ar-load-torus.js', function() { loadTorus( data ); } );
   //   $.when(
   //     $.getScript( 'javascript/armodels/ar-load-torus.js' ),
   //     $.Deferred( function( deferred ) {
   //     $( deferred.resolve );
   //     } )
   //   ).done( function() {
   //    loadTorus( pos );
   //    console.log( 'loadArMode, case:torus' );
   //   } );
//     console.log( 'loadarmode-arDynamicLoadModel emit-:', model, pos );
      var sessionId = socketServer.sessionid;
      socketServer.emit( 'arDynamicLoadModel', data, sessionId );
    break;

    case 'sheep':
      data.file = 'ar-load-sheep.js';
      data.modelName = 'sheep';
      $.when(
        $.getScript( 'javascript/armodels/ar-load-sheep.js' ),
        $.Deferred( function( deferred ) {
        $( deferred.resolve );
        } )
      ).done( function() {
        loadSheep();
      } );
      var sessionId = socketServer.sessionid;
      socketServer.emit( 'arDynamicLoadModel', data, sessionId );
    break;
  }
}

  // Experimental dynamic AR  model loads

//  if ( selectedObject.name === 'arTrigger1' ) {
//    data.file = 'ar-load-iot.js';
//    data.modelName = 'iot';
//
//   $.when(
//        $.getScript( 'javascript/armodels/ar-load-iot.js' ),
//        $.Deferred( function( deferred ) {
//        $( deferred.resolve );
//        } )
//      ).done( function() {
//        loadIotAr();
//        arTrigger1.visible = false;
//      } );
//
//    var sessionId = socketServer.sessionid;
//    socketServer.emit( 'arDynamicLoadModel', data, sessionId );
//  }
//
//  if ( selectedObject.name === 'arTrigger2' ) {
//    data.file = 'ar-load-swordguy.js';
//    data.modelName = 'swordguy';
//
//   $.when(
//        $.getScript( 'javascript/armodels/ar-load-swordguy.js' ),
//        $.Deferred( function( deferred ) {
//        $( deferred.resolve );
//        } )
//      ).done( function() {
//        loadSwordGuy();
//        arTrigger2.visible = false;
//      } );
//
//    var sessionId = socketServer.sessionid;
//    socketServer.emit( 'arDynamicLoadModel', data, sessionId );
//  }
//
//  if ( selectedObject.name === 'arTrigger3' ) {
//    data.file = 'ar-load-sheep.js';
//    data.modelName = 'sheep';
//
//   $.when(
//        $.getScript( 'javascript/armodels/ar-load-sheep.js' ),
//        $.Deferred( function( deferred ) {
//        $( deferred.resolve );
//        } )
//      ).done( function() {
//        loadSheep();
//        arTrigger3.visible = false;
//      } );
//
//    var sessionId = socketServer.sessionid;
//    socketServer.emit( 'arDynamicLoadModel', data, sessionId );
//  }
//
// if ( selectedObject.name === 'arTrigger4' ) {
//   data.file = 'ar-load-geometry.js';
//   data.modelName = 'geometry';

//  $.when(
//       $.getScript( 'javascript/armodels/ar-load-geometry.js' ),
//       $.Deferred( function( deferred ) {
//       $( deferred.resolve );
//       } )
//     ).done( function() {
//       loadGeometry();
//       arTrigger4.visible = false;
//     } );

// }


