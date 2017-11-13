function loadSheep() {

  var loader = new THREE.JSONLoader();

   loader.load( '../armodels/sheep3.json', function( model ) {
     var material = new THREE.MeshPhongMaterial( { color: 0xFF69B4 } );
     sheep = new THREE.Mesh( model, material );
     sheep.scale.set( 0.1, 0.1, 0.1 );
     sheep.position.set( -2.0, -0.4, 0.0 );
     sheep.rotation.x = Math.PI / 2;
     sheep.rotation.y = ( Math.PI / 2 ) * 0.5;
     sheep.rotation.z = ( Math.PI / 2 ) * 0.3;

     sheep.userData.id = sheep.id;

     sheep.name = 'sheep';
     sheep.userData.isSelectable = true;
     sheep.userData.isAnimated = false;
     scene.add( sheep );
     arSelectObjectArray.push( sheep );
    } );

   getArWorldSummary();
 }
