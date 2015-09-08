var arCanvas     = document.getElementById( 'ar-canvas' );
var arPane     = document.getElementById( 'arcanvaspane' );
//var arcontext    = arCanvas.getContext( '2d' );


function initAr() {

  document.getElementById("arcanvaspane").className = "canvascenter";

  arCanvas.style.width = '100%';
  arCanvas.style.height = '100%';
  arCanvas.width = arCanvas.offsetWidth;
  arCanvas.height = arCanvas.offsetHeight;

  var box0Height = document.getElementById( 'box0' ).offsetHeight;
  var box0Width = document.getElementById( 'box0' ).offsetWidth;

  document.getElementById( 'arcanvaspane' ).style.visibility = 'visible';
  document.getElementById( 'arcanvaspane' ).offsetHeight = box0Height;
  document.getElementById( 'arcanvaspane' ).offsetWidth = box0Width;
  document.getElementById( 'arcanvaspane' ).zIndex = 500;
  document.getElementById( 'ar-canvas' ).zIndex = 500;

  var container, camera, scene, renderer, mesh,

    mouse = { x: 0, y: 0 },
    objects = [],

    count = 0,

    CANVAS_WIDTH = 200,
    CANVAS_HEIGHT = 200;

// info
//nfo = document.createElement( 'div' );
//nfo.style.position = 'absolute';
//nfo.style.top = '30px';
//nfo.style.width = '100%';
//nfo.style.textAlign = 'center';
//nfo.style.color = '#f00';
//nfo.style.backgroundColor = 'transparent';
//nfo.style.zIndex = '99';
//nfo.style.fontFamily = 'Monospace';
//nfo.innerHTML = 'INTERSECT Count: ' + count;
//nfo.style.userSelect = "none";
//nfo.style.webkitUserSelect = "none";
//nfo.style.MozUserSelect = "none";
//ocument.body.appendChild( info );


// set the renderer to the AR canvas

renderer = new THREE.WebGLRenderer({ canvas: arCanvas, alpha: true});
renderer.setSize( box0Width, box0Width );

renderer.setClearColor( 0x000000, 0 );

renderer.shadowMapEnabled = true;

//arPane.appendChild( renderer.domElement );

scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera( 50, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1000 );
camera.position.y = 200;
camera.position.z = 500;
camera.lookAt( scene.position );

mesh = new THREE.Mesh(
    new THREE.BoxGeometry( 50, 50, 50, 1, 1, 1 ),
    new THREE.MeshBasicMaterial( {color: 0xfffff})
 );

mesh.castShadow = true;

var spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(10, 20, 20);
spotLight.castShadow = true;
scene.add(spotLight);

//var cubeGeometry = new THREE.CubeGeometry(200, 200, 200);
//var cubeMaterial = new THREE.MeshLambertMaterial({
//  color: "red"
//});
//var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
//cube.castShadow = true;
//scene.add(cube);

var hex  = 0xff0000;
var bbox = new THREE.BoundingBoxHelper( mesh, hex );
bbox.update();
scene.add( bbox );

scene.add( mesh );
objects.push( mesh );

// find intersections
var vector = new THREE.Vector3();
var raycaster = new THREE.Raycaster();

// mouse listener
//document.addEventListener( 'mousedown', function( event ) {
//
//    // For the following method to work correctly, set the canvas position *static*; margin > 0 and padding > 0 are OK
//    mouse.x = ( ( event.clientX - renderer.domElement.offsetLeft ) / renderer.domElement.width ) * 2 - 1;
//    mouse.y = - ( ( event.clientY - renderer.domElement.offsetTop ) / renderer.domElement.height ) * 2 + 1;
//
//    // For this alternate method, set the canvas position *fixed*; set top > 0, set left > 0; padding must be 0; margin > 0 is OK
//    //mouse.x = ( ( event.clientX - container.offsetLeft ) / container.clientWidth ) * 2 - 1;
//    //mouse.y = - ( ( event.clientY - container.offsetTop ) / container.clientHeight ) * 2 + 1;
//
//    vector.set( mouse.x, mouse.y, 0.5 );
//    vector.unproject( camera );
//
//    raycaster.set( camera.position, vector.sub( camera.position ).normalize() );
//
//    intersects = raycaster.intersectObjects( objects );
//
//    if ( intersects.length > 0 ) {
//
//        info.innerHTML = 'INTERSECT Count: ' + ++count;
//
//    }
//
//}, false );

function render() {
    mesh.rotation.y += 0.01;
    renderer.render( scene, camera );
}

(function animate() {
    requestAnimationFrame( animate );
    render();
})();
}
