// custom 'smart' objects

// build an IOT zone(equivilent to bridge) based on it's name

function IotZone( iotZoneName, iotZones ) {
  this.iotZoneName = iotZoneName;
  this.iotZoneUrl = iotZones[iotZoneName];

  this.zoneDevices = function( iotZoneUrl ) {
    var URL = this.iotZoneUrl + '/lights/';
    var allLightState = $.ajax( {
      type: 'GET',
      dataType: 'json',
      url: URL
    } );
    allLightState.done( function( data ) {
      hueLightList = data;
      hueLightListLength = Object.keys( hueLightList ).length;
    } );
    return hueLightList;
  };
}

var steveIotZone = new IotZone( 'steve', iotZones );

function IotObject( deviceName, zone, deviceId ) {
  this.participantState = userContext.participantState;
  this.deviceName = deviceName;
  this.iotZone = zone;
  this.deviceId = deviceId;
  this.iotZoneUrl = iotZones[this.iotZone];
  this.geometry = new THREE.SphereGeometry( 0.2, 16, 16 );
  this.material = new THREE.MeshPhongMaterial( {
    color: 0xFCFC04,
    shininess: 66,
    opacity: 0.5,
    transparent: true
  } );

  THREE.Mesh.call( this, this.geometry, this.material );

  this.init = function() {
    this.name = this.deviceName;
    this.userData.type = 'IotObject';
    this.userData.iotDeviceId = this.deviceId;
    this.userData.isOn = false;
    this.userData.isIot = true;
    this.userData.isSelectable = true;

    arSelectObjectArray.push( this );
    scene.add( this );
  };

  this.init();
}

IotObject.prototype = Object.create( THREE.Mesh.prototype );
IotObject.prototype.constructor = IotObject;

IotObject.prototype.getMesh = function() {
  return this.mesh;
};

IotObject.prototype.moveRandom = function() {
  this.position.x += Math.round( Math.random() ) * 2 - 1;
  this.position.y += Math.round( Math.random() ) * 2 - 1;
  this.position.z += Math.round( Math.random() ) * 2 - 1;
  return this.position.set( this.position.x, this.position.y, this.position.z );
};

IotObject.prototype.setPosition = function( x, y, z ) {
  this.position.set( x, y, z );
};

IotObject.prototype.report = function() {
  console.log( 'Im: ', this.name, 'at: ', this.position );
};

IotObject.prototype.toggleIotDevice = function() {
  if ( this.userData.isOn === false ) {
    this.userData.isOn = true;
    this.material.opacity = 0.2;
  } else {
    this.userData.isOn = false;
    this.material.opacity = 1.0;
  }

  let arShareData = {};
  arShareData.origin = userContext.participantState;
  arShareData.sessionId = userContext.sessionId;
  arShareData.operation = 'toggleIot';
  arShareData.isOn = this.userData.isOn;
  arShareData.iotDeviceId = this.userData.iotDeviceId;
  arShareData.arObjectOpacity = this.material.opacity;
  arShareData.name = this.name;

  // update the peers

  socketServer.emit( 'arObjectShare', arShareData );

  if ( this.participantState === 'focus' ) {
    var dObject = {};
    dObject.on = this.userData.isOn;

    var URL = this.iotZoneUrl + '/lights/' + this.deviceId + '/state';

    $.ajax( {
      type: 'PUT',
      dataType: 'json',
      url: URL,
      data: JSON.stringify( dObject ),
      error: function( a, err ) { }
    } );
  }
};

/**
 * Returns a Video panel associated with an RTCID attached to the virtual camera
 * - maintains physical distance to camera x, y, z location
 *
 * @param   name - the name of the object
 * @param camera - a valid threejs camera object
 * @param rtcchan - the div element of the video for the RTC channel
 * @param - locx, locy, locx -  fixed location relative to the camera (m)
 * @returns threejs object
 *
 * @example
 *     var hud2 = new HudObjectRtc( 'hudVideo1', sphereDrivenCamera, 'box0', 3.0, 0.0, -2.0 );
 */

function HudObjectRtc( name, camera, rtcchan, locx, locy, locz ) {
  this.objName = name;
  this.camera = camera;
  this.rtcchan = rtcchan;
  this.locx = locx;
  this.locy = locy;
  this.locz = locz;

  this.video = document.getElementById( this.rtcchan );

  if ( !navigator.getUserMedia ) {
    document.getElementById( 'errorMessage' ).innerHTML =
      'Sorry. <code>navigator.getUserMedia()</code> is not available.';
  } else {
    navigator.getUserMedia( { video: true }, gotStream, noStream );
  }

  function gotStream( stream ) {
    if ( window.URL ) {
      this.video.src = window.URL.createObjectURL( stream );
    } else {
      this.video.src = stream;
    }
    this.video.onerror = function( e ) {
      stream.stop();
    };
    stream.onended = noStream;
  }

  function noStream( e ) {
    var msg = 'No camera available.';
    if ( e.code == 1 ) {
      msg = 'User denied access to use camera.';
    }
    document.getElementById( 'errorMessage' ).textContent = msg;
  }

  this.videoImage = document.getElementById( 'videoImage' );
  this.videoImageContext = this.videoImage.getContext( '2d' );
  this.videoImageContext.fillStyle = '#000000';
  this.videoImageContext.fillRect( 0, 0, this.videoImage.width, this.videoImage.height );
  this.videoTexture = new THREE.Texture( this.videoImage );
  this.videoTexture.minFilter = THREE.LinearFilter;
  this.videoTexture.magFilter = THREE.LinearFilter;

  this.movieMaterial = new THREE.MeshBasicMaterial( { map: this.videoTexture, overdraw: true, side: THREE.DoubleSide } );
  this.movieGeometry = new THREE.PlaneGeometry( 1.5, 1.5, 1.5, 1 );

  THREE.Mesh.call( this, this.movieGeometry, this.movieMaterial );

  this.init = function() {
    this.visible = true;
    this.name = this.objName;
    this.rotation.y = Math.atan( this.locx / this.locz );
    scene.add( this );
  };

  this.init();
}

HudObjectRtc.prototype = Object.create( THREE.Mesh.prototype );
HudObjectRtc.prototype.constructor = HudObjectRtc;
HudObjectRtc.prototype.getMesh = function() {
  return this.mesh;
};

HudObjectRtc.prototype.update = function() {
  let px = this.camera.position.x + this.locx;
  let py = this.camera.position.y + this.locy;
  let pz = this.camera.position.z + this.locz;
  this.position.set( px, py, pz );

  if ( this.video.readyState === this.video.HAVE_ENOUGH_DATA ) {
    this.videoImageContext.drawImage( this.video, 0, 0, this.videoImage.width, this.videoImage.height );
    if ( this.videoTexture ) {
      this.videoTexture.needsUpdate = true;
    }
  }
};

/**
 * Returns an image panel attached to  virtual camera
 * - maintains physical distance to camera x, y, z location
 *
 * @param   name - the name of the object
 * @param camera - a valid threejs camera object
 * @param image - vallid image from /img
 * @param - locx, locy, locx -  fixed location relative to the camera (m)
 * @returns threejs object
 *
 * @example
 *  var hud1 = new HudObjectImage( 'hudImage1', sphereDrivenCamera, 'exploded.png', -3.0, 0.0, -2.0 );
 */

function HudObjectImage( name, camera, img, locx, locy, locz ) {
  this.objName = name;
  this.camera = camera;
  this.img = img;
  this.locx = locx;
  this.locy = locy;
  this.locz = locz;
  let path = '../../img/';
  this.imagePath = path.concat( this.img );

  var imagePaneTexture2 = new THREE.TextureLoader().load( this.imagePath );
  this.mat = new THREE.MeshBasicMaterial( {
    map: imagePaneTexture2,
    transparent: true,
    opacity: 1.0
  } );
  this.geo = new THREE.PlaneGeometry( 1, 1, 1, 1 );

  THREE.Mesh.call( this, this.geo, this.mat );

  this.init = function() {
    this.visible = true;
    this.name = this.objName;
    this.rotation.y = Math.atan( this.locx / this.locz );
    scene.add( this );
  };

  this.init();
}

HudObjectImage.prototype = Object.create( THREE.Mesh.prototype );
HudObjectImage.prototype.constructor = HudObjectImage;
HudObjectImage.prototype.getMesh = function() {
  return this.mesh;
};

HudObjectImage.prototype.update = function() {
  let px = this.camera.position.x + this.locx;
  let py = this.camera.position.y + this.locy;
  let pz = this.camera.position.z + this.locz;
  this.position.set( px, py, pz );
};

// Frustum Object to track center of camera frustum
//  camera - a valid camera object

function FrustumObject( camera ) {
  this.camera = camera;
  this.participantState = userContext.participantState;
  this.participantState = userContext.arCapable;

  this.geometry = new THREE.SphereGeometry( 0.05, 16, 16 );
  this.material = new THREE.MeshPhongMaterial( {
    color: 0x0000ff,
    shininess: 30,
    opacity: 0.2,
    transparent: true
  } );

  THREE.Mesh.call( this, this.geometry, this.material );

  this.init = function( ) {
    scene.add( this.camera );
    this.camera.add( this );
    this.position.z = -3;

    scene.add( new THREE.CameraHelper( this.camera ) );
  };
  this.init();
}

FrustumObject.prototype = Object.create( THREE.Mesh.prototype );
FrustumObject.prototype.constructor = FrustumObject;
FrustumObject.prototype.getMesh = function() {
  return this.mesh;
};

// an object generated by a spatial DB query

//  data.pLon - decimal degrees
//  data.pLat - decimal degrees
//  data.size array[3] - m
//  data.color - hex
//  data.alt m - relative to origin
//  data.creator - string
//  data.name - string
//  data.world - string

function SpatialObjectFromGeo( data ) {
  this.geometry = new THREE.BoxGeometry( data.size[0], data.size[1], data.size[2] );
  this.material = new THREE.MeshPhongMaterial( {
    shininess: 66,
    opacity: 0.75,
    transparent: true
  } );

  let hexColor = data.color.replace( '#', '0x' );
  this.material.color.setHex( hexColor );

  THREE.Mesh.call( this, this.geometry, this.material );

  var p1 = new LatLon( data.oLat, data.oLon );
  var p2 = new LatLon( data.pLat, data.pLon );
  this.userData.dalt = data.alt;

  this.userData.distance = p1.distanceTo( p2 );
  this.userData.bearing = p1.bearingTo( p2 );

  this.userData.creator = data.creator;
  this.name = data.name;
  this.userData.name = data.name;
  this.userData.world = data.world;

  var threeCartesian = p1.threeXZ( new LatLon( data.pLat, data.pLon ) );
  threeCartesian[1] *= -1;
  this.threeXZ = threeCartesian;

  this.init = function() {
    this.position.set( this.threeXZ[0], this.userData.dalt, this.threeXZ[1] );
  };

  this.init();
}

SpatialObjectFromGeo.prototype = Object.create( THREE.Mesh.prototype );
SpatialObjectFromGeo.prototype.constructor = SpatialObjectFromGeo;
SpatialObjectFromGeo.prototype.getMesh = function() {
  return this.mesh;
};

// a spatial object relative to the origin

//  data.x - m
//  data.y  - m
//  data.z - m
//  data.size array[3] - m
//  data.color - hex
//  data.alt m - relative to origin
//  data.creator - string
//  data.name - string
//  data.world - string

function SpatialObjectRelative( data ) {
  this.loc = data.loc;

  this.geometry = new THREE.BoxGeometry( data.size[0], data.size[1], data.size[2] );
  this.material = new THREE.MeshPhongMaterial( {
    shininess: 90,
    opacity: 1,
    transparent: true
  } );

  let hexColor = data.color.replace( '#', '0x' );
  this.material.color.setHex( hexColor );

  THREE.Mesh.call( this, this.geometry, this.material );

  this.userData.creator = data.creator;
  this.name = data.name;
  this.userData.name = data.name;
  this.userData.world = data.world;

  this.init = function() {
    this.position.set( this.loc[0], this.loc[1], this.loc[2] );
    scene.add( this );
  };

  this.init();
}

SpatialObjectRelative.prototype = Object.create( THREE.Mesh.prototype );
SpatialObjectRelative.prototype.constructor = SpatialObjectRelative;
SpatialObjectRelative.prototype.getMesh = function() {
  return this.mesh;
};

function LoadSphericalImage( name, img ) {
  this.img = img;
  this.name = name;

  let path = '../../spheres/';
  this.imagePath = path.concat( this.img );

  this.geometry = new THREE.SphereGeometry( 25, 20, 20 );
  this.material = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( this.imagePath ) } );

  THREE.Mesh.call( this, this.geometry, this.material );

  this.name = data.name;
  this.userData.name = data.name;

  this.init = function() {
    this.scale.x = -1;
    this.rotateOnAxis( new THREE.Vector3( 0.0, 1.0, 0.0 ), -1.57 );
    scene.add( this );
  };

  this.init();
}

LoadSphericalImage.prototype = Object.create( THREE.Mesh.prototype );
LoadSphericalImage.prototype.constructor = LoadSphericalImage;
LoadSphericalImage.prototype.getMesh = function() {
  return this.mesh;
};

function SpatialImageSelectable( data ) {
  this.loc = data.loc;
  this.img = data.img;
  this.size = data.size;
  this.rotation = data.rotation;

  let path = '../../img/';
  this.imagePath = path.concat( this.img );

  var imagePaneTexture2 = new THREE.TextureLoader().load( this.imagePath );
  this.mat = new THREE.MeshBasicMaterial( {
    map: imagePaneTexture2,
    transparent: true,
    opacity: 0.3
  } );
  this.geo = new THREE.PlaneGeometry( this.size[0], this.size[1], this.size[2], 1 );

  THREE.Mesh.call( this, this.geo, this.mat );

  this.userData.creator = data.creator;
  this.name = data.name;
  this.userData.name = data.name;
  this.userData.world = data.world;

  this.init = function() {
    this.visibile = true;
    this.position.set( this.loc[0], this.loc[1], this.loc[2] );
    //  this.rotation.x = this.rotation[ 0 ];
    //  this.rotation.y = this.rotation[ 1 ];
    //  this.rotation.z = this.rotation[ 2 ];
    scene.add( this );
    arSelectObjectArray.push( this );
  };

  this.init();
}

SpatialImageSelectable.prototype = Object.create( THREE.Mesh.prototype );
SpatialImageSelectable.prototype.constructor = SpatialImageSelectable;
SpatialImageSelectable.prototype.getMesh = function() {
  return this.mesh;
};

// a spatial object relative to the origin

//  data.x - m
//  data.y  - m
//  data.z - m
//  data.size - m
//  data.color - hex
//  data.alt m - relative to origin
//  data.creator - string
//  data.name - string
//  data.world - string

function SpatialObjectSelectable( data ) {
  this.loc = data.loc;
  this.size = data.size;
  this.color = data.color;

  this.geo = new THREE.SphereGeometry( this.size, 16, 16 );
  this.mat = new THREE.MeshPhongMaterial( {
    shininess: 66,
    opacity: 0.5,
    transparent: true
  } );

  let hexColor = this.color.replace( '#', '0x' );
  this.mat.color.setHex( hexColor );

  THREE.Mesh.call( this, this.geo, this.mat );

  this.userData.creator = data.creator;
  this.name = data.name;
  this.userData.name = data.name;
  this.userData.world = data.world;
  this.userData.creator = data.creator;

  this.init = function() {
    this.position.set( this.loc[0], this.loc[1], this.loc[2] );
    scene.add( this );
    arSelectObjectArray.push( this );
  };

  this.init();
}

SpatialObjectSelectable.prototype = Object.create( THREE.Mesh.prototype );
SpatialObjectSelectable.prototype.constructor = SpatialObjectSelectable;
SpatialObjectSelectable.prototype.getMesh = function() {
  return this.mesh;
};

/**
 * Returns an object at a cardinal point
 * - maintains physical distance to camera x, y, z location
 *
 * @param   orientation - one of N, S, E, W, U, D
 * @returns threejs object
 *
 * @example
 *     var cardN = new CardinalObject( 'N' );
 */

function CardinalObject( orientation ) {
  this.orientation = orientation;
  this.cMat = new THREE.MeshPhongMaterial( {
    color: 0xFF0000,
    shininess: 66,
    opacity: 1.0,
    transparent: true
  } );
  this.cGeo = new THREE.SphereGeometry( 0.1, 16, 16 );

  THREE.Mesh.call( this, this.cGeo, this.cMat );

  this.init = function() {
    switch ( this.orientation ) {
      case 'N':
        this.position.set( 0.0, 0.0, -20.0 );
        this.name = 'sphereN';
        break;
      case 'S':
        this.position.set( 0.0, 0.0, 20.0 );
        this.name = 'sphereS';
        break;
      case 'E':
        this.position.set( 20.0, 0.0, 0.0 );
        this.name = 'sphereE';
        break;
      case 'W':
        this.position.set( -20.0, 0.0, 0.0 );
        this.name = 'sphereW';
        break;
      case 'U':
        this.name = 'sphereU';
        this.position.set( 0.0, -20.0, 0.0 );
        break;
      case 'D':
        this.position.set( 0.0, 20.0, 0.0 );
        this.name = 'sphereD';
        break;
      default:
        break;
    }
scene.add( this );
};

this.init();
}

CardinalObject.prototype = Object.create( THREE.Mesh.prototype );
CardinalObject.prototype.constructor = CardinalObject;
CardinalObject.prototype.getMesh = function() {
  return this.mesh;
};
