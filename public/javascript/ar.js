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

var sphere = new THREE.Mesh( new THREE.SphereGeometry(
    radius,
    segments,
    rings),
  sphereMaterial);

sphere.position.set(0.0, 2.0, 0.0);
scene.add(sphere);

pivotPoint = new THREE.Object3D();
pivotPoint.rotation.x = 0.4;
sphere.add(pivotPoint);

// add the sphere to the scene
//scene.add(sphere);


var cubeGeometry = new THREE.BoxGeometry( .3, .5, .7 );
var sphereGeometry1 = new THREE.SphereGeometry( .5, 16, 16 );

var material = new THREE.MeshLambertMaterial( { color: 'red' } );
var material1 = new THREE.MeshLambertMaterial( { color: 0x008000 } );
var material2 = new THREE.MeshPhongMaterial( {color: 'blue' } );
var sphereMaterial1 = new THREE.MeshLambertMaterial(
    {
      color: 'yellow'
    });

var sphereMaterial2 = new THREE.MeshLambertMaterial(
    {
      color: 0x0066FF
    });

var orbitSphereMaterial = new THREE.MeshLambertMaterial(
    {
      color: 0xB24700
    });


var cube = new THREE.Mesh( cubeGeometry, material );
cube.castShadow = true;
cube.position.set(2.5, 1.0, 1.0);
pivotPoint.add( cube );

var orbitCube = new THREE.Mesh( cubeGeometry, material );
orbitCube.castShadow = true;
orbitCube.position.set(2.5, 1.0, 1.0);
scene.add(orbitCube);

var knotGeometry = new THREE.TorusKnotGeometry( .2, .15, 100, 16 );
var knotMaterial = new THREE.MeshPhongMaterial( { color: 0xffff00 } );
var orbitKnot = new THREE.Mesh( knotGeometry, knotMaterial );
orbitKnot.position.set(3.5, 1.0, 1.0);
scene.add(orbitKnot);


var cube1 = new THREE.Mesh( cubeGeometry, material );
var cube2 = new THREE.Mesh( cubeGeometry, material1 );
var cube3 = new THREE.Mesh( cubeGeometry, material2 );
var sphere1 = new THREE.Mesh( sphereGeometry1, sphereMaterial );
var sphere2 = new THREE.Mesh( sphereGeometry1, sphereMaterial1 );
var sphere3 = new THREE.Mesh( sphereGeometry1, sphereMaterial2 );


cube1.position.set(4.0, 5.0, 0.0);
cube2.position.set(7.0, 3.0, 0.8);
cube3.position.set(9.0, 3.0, 0.95);
sphere1.position.set(2.0, 5.0, 0.9);
sphere2.position.set(-2.0, 5.0, 0.0);


scene.add(cube1);
scene.add(cube2);
scene.add(cube3);
scene.add( sphere1 );
scene.add( sphere2 );

// orbiting sphere

var orbitSphere = new THREE.Mesh( new THREE.SphereGeometry(
    radius,
    segments,
    rings),
  orbitSphereMaterial);

orbitSphere.position.set(5.0, 1.0, .5);
scene.add(orbitSphere);

var orbitSphereFocus = new THREE.Mesh( new THREE.SphereGeometry(
    radius,
    segments,
    rings),
  orbitSphereMaterial);
scene.add(orbitSphereFocus);


var orbitSpherePivotPoint = new THREE.Object3D();
orbitSpherePivotPoint.position.set(4.0, 3.0, 0.0);
orbitSpherePivotPoint.rotation.x = 0.7;
orbitSphereFocus.add( orbitSpherePivotPoint );
orbitSpherePivotPoint.add(orbitKnot);


//  canera and light

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

arCameraControls = new THREE.DeviceOrientationControls( camera );

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

function animate() {

  arCameraControls.update();

  pivotPoint.rotation.x += .05;
  pivotPoint.rotation.y += .05;

  cube.rotation.x += 0.05;
  cube.rotation.y += 0.05;

  orbitKnot.rotation.x += 0.05;
  orbitKnot.rotation.y += 0.05;

  orbitSpherePivotPoint.rotation.y += 0.01;
  //orbitSpherePivotPoint.rotation.x += 0.02;

  cube1.rotation.x += 0.05;
  cube1.rotation.y += 0.05;

  cube2.rotation.x += 0.05;
  cube2.rotation.y += 0.05;

  renderer.render(scene, camera);

  requestAnimationFrame( animate );

}

animate();

}
