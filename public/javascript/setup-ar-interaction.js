function setupArInteractionEvents() {

//
// Establish the user interation with the AR objects
//  - set the cameraDriver based on AR/VR and focus/peer
//

socketServer.on( 'addNewArObject', function( data ) {
  console.log( 'Test msg at setup-ar-interaction: recieved on placeArObject', data.object, data.name );
    arShareData.operation = 'newObject';
    arShareData.x = data.x;
    arShareData.y = data.y;
    arShareData.z = data.z;

    addNewArObjectToWorld( arShareData );

  } );

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
    var sessionId = socketServer.sessionid;
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

    console.log( 'longpress' );

    event.preventDefault();

    var mouse3D = new THREE.Vector3( ( event.clientX - offsetX ) / viewWidth * 2 - 1,
                              -( event.clientY - offsetY ) / viewHeight * 2 + 1, 0.5 );

    mouse3D.unproject( cameraDriver );
    var dir = mouse3D.sub( cameraDriver.position ).normalize();
    var raycaster = new THREE.Raycaster( cameraDriver.position, mouse3D );

  //  var scale = 4.0;

    var pos = cameraDriver.position.clone().add( dir.multiplyScalar( 6 ) );

        arShareData.operation = 'newObject';
        arShareData.x = pos.x;
        arShareData.y = pos.y;
        arShareData.z = pos.z;

    addNewArObjectToWorld( arShareData );
    return false;
    },

  function( e ) {
      return false;
  }, 750 );

  function addNewArObjectToWorld( d ) {
      var materialTorus1 = new THREE.MeshLambertMaterial( { color: 0x1947D1 } );
      var geometryTorus1 = new THREE.TorusGeometry( 0.3, 0.2, 100, 16 );
      var arUserCreatedObject = new THREE.Mesh( geometryTorus1, materialTorus1 );

      arUserCreatedObject.position.set( d.x, d.y, d.z );
      arUserCreatedObject.userData.id = arUserCreatedObject.id;
      arUserCreatedObject.userData.objectType =  'bagel';
      arUserCreatedObject.name = arUserCreatedObject.id;
      arUserCreatedObject.userData.isAnimated = false;
      arUserCreatedObject.userData.isUserCreated = true;
      arUserCreatedObject.userData.isSelectable = true;
      arUserCreatedObject.userData.createdBy = userContext.rtcId;

      scene.add( arUserCreatedObject );
      arSelectObjectArray.push( arUserCreatedObject );

  // push the new object to peers

      var newArObj = {};
      newArObj.operation = 'newObject';
      newArObj.x = d.x;
      newArObj.y = d.y;
      newArObj.z = d.z;
      newArObj.id = arUserCreatedObject.id;
      newArObj.createdBy = userContext.rtcId;
      newArObj.isSelectable = true;
      newArObj.isUserCreated = true;
      newArObj.objectType = 'bagel';

      emitArObject( newArObj );
    }

    function pushNewArObject( d ) {
      var newArObj = {};
      newArObj.operation = 'newObject';
      newArObj.x = d.x;
      newArObj.y = d.y;
      newArObj.z = d.z;
      newArObj.id = arUserCreatedObject.id;
      newArObj.createdBy = userContext.rtcId;

      emitArObject( newArObj );
    }

// Select an AR object with a single click

 function onArSelect( event ) {

     event.preventDefault();

     var vector = new THREE.Vector3( ( event.clientX - offsetX ) / viewWidth * 2 - 1,
                             -( event.clientY - offsetY ) / viewHeight * 2 + 1, 0.5 );

     projector.unprojectVector( vector, cameraDriver );
     vector.sub( cameraDriver.position );
     vector.normalize();
     var rayCaster = new THREE.Raycaster( cameraDriver.position, vector );
     var intersects = rayCaster.intersectObjects( arSelectObjectArray );
     var selectedObject = intersects[0].object;
     console.log( 'intersects:', intersects, selectedObject );

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

       if ( selectedObject.userData.isUserCreated === true ) {

        if ( selectedObject.userData.isAnimated === false ) {
          selectedObject.userData.isAnimated = true;
          } else {
          selectedObject.userData.isAnimated = false;
        }
         arShareData.operation = 'animateSelectedObject';
         arShareData.id = selectedObject.userData.iotDeviceId;
         arShareData.isAnimated = selectedObject.userData.isAnimated;

         emitArObject( arShareData );

         return;
       }

    // Special Cases - Hardwired by name

     if ( intersects[0].object.name === 'knot' ) {
         isAnimateKnot = !isAnimateKnot;

         animateArObjects();

         return;
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

     if ( intersects[0].object.name === 'swordGuyMesh' ) {
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
     }

  // Experimental dynamic AR  model loads

  if ( selectedObject.name === 'arTrigger1' ) {
    data.file = 'ar-load-iot.js';
    data.modelName = 'iot';

   $.when(
        $.getScript( 'javascript/armodels/ar-load-iot.js' ),
        $.Deferred( function( deferred ) {
        $( deferred.resolve );
        } )
      ).done( function() {
        loadIotAr();
        arTrigger1.visible = false;
      } );

    var sessionId = socketServer.sessionid;
    socketServer.emit( 'arDynamicLoadModel', data, sessionId );
  }

  if ( selectedObject.name === 'arTrigger2' ) {
    data.file = 'ar-load-swordguy.js';
    data.modelName = 'swordguy';

   $.when(
        $.getScript( 'javascript/armodels/ar-load-swordguy.js' ),
        $.Deferred( function( deferred ) {
        $( deferred.resolve );
        } )
      ).done( function() {
        loadSwordGuy();
        arTrigger2.visible = false;
      } );

    var sessionId = socketServer.sessionid;
    socketServer.emit( 'arDynamicLoadModel', data, sessionId );
  }

  if ( selectedObject.name === 'arTrigger3' ) {
    data.file = 'ar-load-sheep.js';
    data.modelName = 'sheep';

   $.when(
        $.getScript( 'javascript/armodels/ar-load-sheep.js' ),
        $.Deferred( function( deferred ) {
        $( deferred.resolve );
        } )
      ).done( function() {
        loadSheep();
        arTrigger3.visible = false;
      } );

    var sessionId = socketServer.sessionid;
    socketServer.emit( 'arDynamicLoadModel', data, sessionId );
  }

  if ( selectedObject.name === 'arTrigger4' ) {
    data.file = 'ar-load-geometry.js';
    data.modelName = 'geometry';

   $.when(
        $.getScript( 'javascript/armodels/ar-load-geometry.js' ),
        $.Deferred( function( deferred ) {
        $( deferred.resolve );
        } )
      ).done( function() {
        loadGeometry();
        arTrigger4.visible = false;
      } );

    var sessionId = socketServer.sessionid;
    socketServer.emit( 'arDynamicLoadModel', data, sessionId );
  }
 }
}
}

socketServer.on( 'arDynamicLoadModel', function( data ) {

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
        arTrigger1.visible = false;
      } );
    }

    if ( data.modelName === 'swordguy' ) {
    var filePath =  'javascript/armodels/' + data.file;
      $.when(
        $.getScript( filePath ),
        $.Deferred( function( deferred ) {
        $( deferred.resolve );
        } )
      ).done( function() {
        loadSwordGuy();
        arTrigger2.visible = false;
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
        arTrigger3.visible = false;
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
        loadGeometry();
        arTrigger4.visible = false;
      } );
    }
  } );

function loadArModel( model ) {
  switch ( model ) {
    case 'iot':
    console.log( 'at loadArModel:', model );
    data.file = 'ar-load-iot.js';
    data.modelName = 'iot';
    $.when(
        $.getScript( 'javascript/armodels/ar-load-iot.js' ),
        $.Deferred( function( deferred ) {
        $( deferred.resolve );
        } )
      ).done( function() {
        loadIotAr();
        arTrigger1.visible = false;
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
        arTrigger2.visible = false;
      } );
      var sessionId = socketServer.sessionid;
      socketServer.emit( 'arDynamicLoadModel', data, sessionId );
    break;

    case 'geometry':
      data.file = 'ar-load-geometry.js';
      data.modelName = 'geometry';
      $.when(
        $.getScript( 'javascript/armodels/ar-load-geometry.js' ),
        $.Deferred( function( deferred ) {
        $( deferred.resolve );
        } )
      ).done( function() {
        loadGeometry();
        arTrigger4.visible = false;
      } );
      var sessionId = socketServer.sessionid;
      socketServer.emit( 'arDynamicLoadModel', data, sessionId );
    break;

    case 'pig':
      data.file = 'ar-load-sheep.js';
      data.modelName = 'sheep';
      $.when(
        $.getScript( 'javascript/armodels/ar-load-sheep.js' ),
        $.Deferred( function( deferred ) {
        $( deferred.resolve );
        } )
      ).done( function() {
        loadSheep();
        arTrigger3.visible = false;
      } );
      var sessionId = socketServer.sessionid;
      socketServer.emit( 'arDynamicLoadModel', data, sessionId );
    break;
  }
}
