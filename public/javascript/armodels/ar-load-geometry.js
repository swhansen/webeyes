function loadGeometry() {

//    var geometryCube1 = new THREE.BoxGeometry( 0.5, 0.5, 0.5, 2, 2, 2 );
//    var geometryKnot = new THREE.TorusKnotGeometry( 0.3, 0.3, 100, 16 );
//
//    var material1 = new THREE.MeshLambertMaterial( { color: 0xff0000 } );
//    var material3 = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
//    var materialKnot = new THREE.MeshPhongMaterial( { color: 0xffff00 } );
//    var materialO = new THREE.MeshLambertMaterial( { color: 'red' } );
//
//    var cube1 = new THREE.Mesh( geometryCube1, material1 );
//    var sphere = new THREE.Mesh( geometrySphere, material3 );
//    var knot = new THREE.Mesh( geometryKnot, materialKnot );
//    knot.userData.isSelectable = true;
//
//    lampSphere = new THREE.Mesh( geometrySphere, materialO );
//    lampSphere.position.set( -19.0, 16.0, 8.0 );
//    scene.add( lampSphere );
//
//    cube1.position.set( 0.0, 0.0,  -4.0 );
//    sphere.position.set( 1.2, -0.2, -4.0 );
//    knot.position.set( 0.5, 0.22, -5.0 );
//
    var geometryCube2 = new THREE.BoxGeometry( 0.8, 0.8, 0.8 );
    var material2 = new THREE.MeshPhongMaterial( { color: 'blue' } );
    var cube2 = new THREE.Mesh( geometryCube2, material2 );
    cube2.position.set( -2.0, 0.0, -6.0 );
    cube2.rotateZ = 10.00;
    cube2.position.set( -2.0, 0.0, -6.0 );
    cube2.name = 'cube2';
    cube2.userData.isSelectable = true;
    cube2.userData.isAnimated = false;
    arSelectObjectArray.push( cube2 );
    scene.add( cube2 );
}
