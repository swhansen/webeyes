
'use strict';

// Handler for AR objects communication between peers

function arObjectBroadcastHandler( data ) {

    switch ( data.operation ) {

      case 'moveObject':
        var arObject = scene.getObjectByName( data.name );
        console.log( 'case - moveObject:', arObject );
        arObject.material.color.setRGB( data.color.r, data.color.g, data.color.b );
        arMoveObject( data );

      break;

      case  'toggleIot':

        console.log('arObjectBroadcastHandler-case-iotToggle: ', data );
        hueSetLightStateXY( data.iotDeviceId, data.isOn, [ 0.5, 0.5 ], 100 );
        arObject = scene.getObjectByName( data.name );
        arObject.material.opacity = data.arObjectOpacity;

      break;

     // case 'newObject':
     //   var materialTorus1 = new THREE.MeshLambertMaterial( { color: 0xf7ef19 } );
     //   var geometryTorus1 = new THREE.TorusGeometry( 0.3, 0.2, 100, 16 );
     //   var arUserCreatedObject = new THREE.Mesh( geometryTorus1, materialTorus1 );
//
     //   arUserCreatedObject.position.set( data.x, data.y, data.z );
     //   arUserCreatedObject.name = data.name;
     //   scene.add( arUserCreatedObject );
//
     //   arUserCreatedObject.userData.id = data.id;
     //   arUserCreatedObject.userData.isAnimated = false;
     //   arUserCreatedObject.userData.isUserCreated = true;
     //   arUserCreatedObject.userData.isSelectable = true;
     //   arUserCreatedObject.userData.createdBy = data.createdBy;
     //   arUserCreatedObject.userData.objectType = data.objectType;
//
     //   arSelectObjectArray.push( arUserCreatedObject );
     // break;

      case 'animateSelectedObject':

        if ( data.name === 'sheep' ) {
            arObject = scene.getObjectByName( data.name );
            arObject.rotation.x = data.rotation._x;
            arObject.rotation.y = data.rotation._y;
            arObject.rotation.z = data.rotation._z;
            arObject.material.color.setRGB( data.color.r, data.color.g, data.color.b );
            arObject.userData.isAnimated = data.isAnimated;
          }

        if ( data.name === 'swordGuyMesh' ) {
          arObject = scene.getObjectByName( data.name );
          arObject.userData.isAnimated = data.animate;
        }

        if ( data.name === 'torus' ) {
        arObject = scene.getObjectByName( data.name );
        arObject.userData.isAnimated = data.animate;
        }

      break;

      case 'hideSelectedObject':

      break;
  }
}

  function arMoveObject( data ) {
    var arObject = scene.getObjectByName( data.name );
    console.log( 'arMoveObject:', data );
      if ( data.position ) {
          arObject.position.x = data.position.x;
          arObject.position.y = data.position.y;
          arObject.position.z = data.position.z;
        }
      if ( data.rotation ) {
          arObject.rotation.x = data.rotation._x;
          arObject.rotation.y = data.rotation._y;
          arObject.rotation.z = data.rotation._z;
        }
  }

  function removeUserCreatedArObjects() {
    scene.children.forEach( function( child ) {
      if ( child.userData.isUserCreated ) {
        scene.remove( child );
      }
    } );
    arSelectObjectArray = [];
    }
