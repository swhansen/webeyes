function loadGeometry( pos ) {

  console.log( 'loadGeometry:', pos );

    var geometryCube2 = new THREE.BoxGeometry( 0.8, 0.8, 0.8 );
    var material2 = new THREE.MeshPhongMaterial( { color: 'blue' } );
    var cube2 = new THREE.Mesh( geometryCube2, material2 );
    cube2.position.set( -2.0, 0.0, -6.0 );
    cube2.rotateZ = 10.00;
    cube2.name = 'cube2';
    cube2.userData.isSelectable = true;
    cube2.userData.isAnimated = false;
    cube2.userData.isUserCreated = true;
    cube2.userData.createdBy = userContext.rtcId;
    arSelectObjectArray.push( cube2 );

    if ( typeof pos === 'undefined' ) {
      cube2.position.set( -2.0, 0.0, -6.0 );
    } else {
      cube2.position.set( pos.x, pos.y, pos.z );
    }

    scene.add( cube2 );

    getArWorldSummary();
}
