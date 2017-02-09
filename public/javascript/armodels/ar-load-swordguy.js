 function loadSwordGuy() {

 // Sword guy

  var geometry = new THREE.PlaneGeometry( 16000, 16000 );
  var material = new THREE.MeshPhongMaterial( { emissive: 0x888888 } );

  var loader = new THREE.JSONLoader();

  loader.load( '../armodels/knight.js', function( geometry, materials ) {createSwordGuy( geometry, materials, 0, -15.0, 65.0, 3.0 );
         } );
  }

function createSwordGuy( geometry, materials, x, y, z, s ) {

  var mesh, helper;
  var facesClip, bonesClip;

  geometry.computeBoundingBox();
  var bb = geometry.boundingBox;
  for ( var i = 0; i < materials.length; i++ ) {
    var m = materials[ i ];
    m.skinning = true;
    m.morphTargets = true;
    m.specular.setHSL( 0, 0, 0.1 );
    m.color.setHSL( 0.6, 0, 0.6 );
     }
  swordGuyMesh = new THREE.SkinnedMesh( geometry, new THREE.MultiMaterial( materials ) );
  swordGuyMesh.position.set( x, y - bb.min.y * s, z );
  swordGuyMesh.scale.set( s, s, s );
  swordGuyMesh.rotation.y =  -Math.PI;
  swordGuyMesh.name = 'swordGuyMesh';
  swordGuyMesh.userData.objectType =  'swordGuyMesh';
  swordGuyMesh.userData.isAnimated = false;
  swordGuyMesh.userData.isUserCreated = false;
  swordGuyMesh.userData.isSelectable = true;
  swordGuyMesh.userData.createdBy = 'system';

  scene.add( swordGuyMesh );
  arSelectObjectArray.push( swordGuyMesh );

      //   swordGuyMesh.castShadow = true;
      //   swordGuyMesh.receiveShadow = true;

  helper = new THREE.SkeletonHelper( swordGuyMesh );
  helper.material.linewidth = 3;
  helper.visible = false;
  scene.add( helper );

  mixer = new THREE.AnimationMixer( swordGuyMesh );
  var bonesClip = geometry.animations[0];
  var facesClip = THREE.AnimationClip.CreateFromMorphTargetSequence( 'facialExpressions', swordGuyMesh.geometry.morphTargets, 3 );

  mixer.clipAction( bonesClip ).setDuration( 3.0 ).play();
  mixer.clipAction( facesClip ).setDuration( 2.0 ).play();
}

getArWorldSummary();
