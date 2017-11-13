function loadTorus( data ) {

    var materialTorus1 = new THREE.MeshLambertMaterial( { color: 'red' } );
    var geometryTorus1 = new THREE.TorusGeometry( 0.3, 0.2, 100, 16 );
    var torus = new THREE.Mesh( geometryTorus1, materialTorus1 );

    torus.rotateZ = 10.00;
    torus.name = 'torus';
    torus.userData.isSelectable = true;
    torus.userData.isAnimated = false;
    torus.userData.isUserCreated = true;
    torus.userData.createdBy = userContext.rtcId;
    arSelectObjectArray.push( torus );

    if ( typeof data === 'undefined' ) {
      torus.position.set( -2.0, 0.0, -6.0 );
    } else {
      torus.position.set( data.x, data.y, data.z );
    }
    console.log( 'loadTorus-scene.add', data );
    scene.add( torus );
    getArWorldSummary();
}
