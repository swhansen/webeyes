var arCanvas     = document.getElementById( 'ar-canvas' );
var arPane     = document.getElementById( 'arcanvaspane' );

function orientationAr() {

  document.getElementById('cube').style.visibility = 'visible';
  document.getElementById('cube').style.zIndex = '99';

  if (!window.DeviceOrientationEvent) {
            console.log("no device orientstion");
     } else {
        window.addEventListener('deviceorientation', function(event) {
           document.getElementById('cube').style.webkitTransform =
           document.getElementById('cube').style.transform =
                   'rotateX(' + event.beta + 'deg) ' +
                   'rotateY(' + event.gamma + 'deg) ' +
                   'rotateZ(' + event.alpha + 'deg)';
        });
     }
       }

function geometryAr() {

  document.getElementById("arcanvaspane").className = "canvascenter";

  //arCanvas.style.width = '100%';
  //arCanvas.style.height = '100%';
  //arCanvas.width = arCanvas.offsetWidth;
  //arCanvas.height = arCanvas.offsetHeight;

  var box0Height = document.getElementById( 'box0' ).offsetHeight;
  var box0Width = document.getElementById( 'box0' ).offsetWidth;

  //document.getElementById( 'arcanvaspane' ).style.visibility = 'visible';
  //document.getElementById( 'arcanvaspane' ).offsetHeight = box0Height;
  //document.getElementById( 'arcanvaspane' ).offsetWidth = box0Width;


var viewBox = document.getElementById( 'box0' );

  arcanvaspane.style.width = viewBox.style.width;
  arcanvaspane.style.height = viewBox.style.height;
  arcanvaspane.style.left = viewBox.style.left;
  arcanvaspane.style.top = viewBox.style.top;
  arcanvaspane.style.visibility = 'visible';

  var container, camera, scene, renderer, mesh,
    CANVAS_WIDTH = 300,
    CANVAS_HEIGHT = 300;

scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera( 50, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1000 );

// set the renderer to the AR canvas

renderer = new THREE.WebGLRenderer({ canvas: arCanvas, alpha: true});
renderer.setSize( box0Width, box0Width );

renderer.setClearColor( 0x000000, 0 );

//sphere

var radius = .3,
    segments = 16,
    rings = 16;

  var sphereMaterial = new THREE.MeshLambertMaterial(
    {
      color: 'blue'
    });

// create a new mesh with
// sphere geometry - we will cover
// the sphereMaterial next!
var sphere = new THREE.Mesh( new THREE.SphereGeometry(
    radius,
    segments,
    rings),
  sphereMaterial);

sphere.position.set(0.0, 0.0, 0.0);
//sphere.position.x = -2.0;
sphere.position.y = 1.0;
//sphere.position.z = .2;
scene.add(sphere);


pivotPoint = new THREE.Object3D();
pivotPoint.rotation.x = 0.4;
sphere.add(pivotPoint);


// add the sphere to the scene
//scene.add(sphere);

//cube

var geometry = new THREE.BoxGeometry( .3, .5, .7 );
var material = new THREE.MeshLambertMaterial( { color: 'red' } );
var cube = new THREE.Mesh( geometry, material );
cube.castShadow = true;
cube.position.set(2.5, 1.0, 1.0);
pivotPoint.add( cube );

//  light

camera.position.x = 4;
  camera.position.y = 4;
  camera.position.z = 4;
  camera.lookAt(scene.position);

 var light = new THREE.SpotLight();
    light.position.set(40, 4, 40);
    light.castShadow = true;
    light.shadowMapEnabled = true;
    light.shadowCameraNear = 20;
    light.shadowCameraFar = 100;
    ;

    scene.add(light);

//  drive the virtual camera with the orientation sensors

controls = new THREE.DeviceOrientationControls( camera );

//function render() {
//  // control the rotation rate
//
//  var fps = 20;
//
//  setTimeout(function() {
//
//  requestAnimationFrame( render );
//
//  pivotPoint.rotation.x += .1;
//  pivotPoint.rotation.y += .1;
//
//  cube.rotation.x += 0.1;
//  cube.rotation.y += 0.1;
//
//  renderer.render( scene, camera );
//}, 1000 / fps);
//
//};
//
//render();


//renderer = new THREE.WebGLRenderer( { alpha: true } );


function animate() {

  controls.update();

  pivotPoint.rotation.x += .1;
  pivotPoint.rotation.y += .1;

  cube.rotation.x += 0.1;
  cube.rotation.y += 0.1;

  renderer.render(scene, camera);

  requestAnimationFrame( animate );

}

animate();

}
