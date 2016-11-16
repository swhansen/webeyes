
function  loadIotAr() {


console.log( 'At loadIotAR' );

 var hueGeometrySphere = new THREE.SphereGeometry( 0.2, 16, 16 );

  var hueLightmaterial1 = new THREE.MeshPhongMaterial ( {
      color: 0xff00ff,
      shininess: 66,
      opacity:0.5,
      transparent: true
  } );

  var hueLightmaterial2 = new THREE.MeshPhogMterial ( {
      color: 0xff00ff,
      shininess: 66,      opacity:0.5,
     transparent: true
   } );

   var hueLightmaterial3 = new THREE.MeshPhongMaterial ( {
      color: 0xff00ff,
      shininess: 66,
      opacity:0.5,
      transparent: true
  } );

  var hueLightmaterial4 = new THREE.MeshPhongMaterial ( {
      color: 0xff00ff,
      shininess: 66,
      opacity:0.5,
      transparent: true
  } );

    hueLight1 = new THREE.Mesh( hueGeometrySphere, hueLightmaterial1 );
    hueLight2 = new THREE.Mesh( hueGeometrySphere, hueLightmaterial2 );
    hueLight3 = new THREE.Mesh( hueGeometrySphere, hueLightmaterial3 );
    hueLight4 = new THREE.Mesh( hueGeometrySphere, hueLightmaterial4 );

    hueLight1.position.set( -0.809, -0.737, -5.227 );
    hueLight2.position.set( 1.077, 1.606, -5.17 );
    hueLight3.position.set( -2.785, 1.606, -5.17 );
    hueLight4.position.set( -0.809, 1.606, -5.17 );

    hueLight1.userData.isSelectable = true;
    hueLight2.userData.isSelectable = true;
    hueLight3.userData.isSelectable = true;
    hueLight4.userData.isSelectable = true;

    hueLight1.name = 'hueLight1';
    hueLight2.name = 'hueLight2';
    hueLight3.name = 'hueLight3';
    hueLight4.name = 'hueLight4';

    hueLight1.userData.isIot = true;
    hueLight2.userData.isIot = true;
    hueLight3.userData.isIot = true;
    hueLight4.userData.isIot = true;

    hueLight1.userData.iotDeviceId = 1;
    hueLight2.userData.iotDeviceId = 2;
    hueLight3.userData.iotDeviceId = 3;
    hueLight4.userData.iotDeviceId = 4;

    hueLight1.userData.isOn = false;
    hueLight2.userData.isOn = false;
    hueLight3.userData.isOn = false;
    hueLight4.userData.isOn = false;

    scene.add( hueLight1 );
    scene.add( hueLight2 );
    scene.add( hueLight3 );
    scene.add( hueLight4 );

    arSelectObjectArray.push( hueLight1 );
    arSelectObjectArray.push( hueLight2 );
    arSelectObjectArray.push( hueLight3 );
    arSelectObjectArray.push( hueLight4 );

  // end hue light objects

}
