var arCanvas     = document.getElementById( 'ar-canvas' );
var arPane     = document.getElementById( 'arcanvaspane' );

function orientationAr() {
  document.getElementById('cube').style.visibility = 'visible';

  if (!window.DeviceOrientationEvent) {
            console.log("no device orientstion");
         } else {


            window.addEventListener('deviceorientation', function(event) {
               document.getElementById('cube').style.webkitTransform =
               document.getElementById('cube').style.transform =
                       'rotateX(' + event.beta + 'deg) ' +
                       'rotateY(' + event.gamma + 'deg) ' +
                       'rotateZ(' + event.alpha + 'deg)';

        //       document.getElementById('beta').innerHTML = Math.round(event.beta);
        //       document.getElementById('gamma').innerHTML = Math.round(event.gamma);
        //       document.getElementById('alpha').innerHTML = Math.round(event.alpha);
        //       document.getElementById('is-absolute').innerHTML = event.absolute ? "true" : "false";
            });
         }

         //if (!window.DeviceMotionEvent) {
         //   document.getElementById('dm-unsupported').classList.remove('hidden');
         //} else {
         //  // document.getElementById('dm-info').classList.remove('hidden');
//
         //   window.addEventListener('devicemotion', function(event) {
         //      document.getElementById('acceleration-x').innerHTML = Math.round(event.acceleration.x);
         //      document.getElementById('acceleration-y').innerHTML = Math.round(event.acceleration.y);
         //      document.getElementById('acceleration-z').innerHTML = Math.round(event.acceleration.z);
//
         //      document.getElementById('acceleration-including-gravity-x').innerHTML =
         //              Math.round(event.accelerationIncludingGravity.x);
         //      document.getElementById('acceleration-including-gravity-y').innerHTML =
         //              Math.round(event.accelerationIncludingGravity.y);
         //      document.getElementById('acceleration-including-gravity-z').innerHTML =
         //              Math.round(event.accelerationIncludingGravity.z);
//
         //      document.getElementById('rotation-rate-beta').innerHTML = Math.round(event.rotationRate.beta);
         //      document.getElementById('rotation-rate-gamma').innerHTML = Math.round(event.rotationRate.gamma);
         //      document.getElementById('rotation-rate-alpha').innerHTML = Math.round(event.rotationRate.alpha);
//
         //      document.getElementById('interval').innerHTML = event.interval;
         //   });
         //}
       }

function geometryAr() {

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
 // document.getElementById( 'arcanvaspane' ).zIndex = 500;
 // document.getElementById( 'ar-canvas' ).zIndex = 500;

  var container, camera, scene, renderer, mesh,

    mouse = { x: 0, y: 0 },
    objects = [],

    count = 0,

    CANVAS_WIDTH = 200,
    CANVAS_HEIGHT = 200;

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

var hex  = 0xff0000;
var bbox = new THREE.BoundingBoxHelper( mesh, hex );
bbox.update();
scene.add( bbox );

scene.add( mesh );
objects.push( mesh );

// find intersections
var vector = new THREE.Vector3();
var raycaster = new THREE.Raycaster();

function render() {
    mesh.rotation.y += 0.01;
    renderer.render( scene, camera );
}

(function animate() {
    requestAnimationFrame( animate );
    render();
})();
}
