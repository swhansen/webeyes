// custom 'smart' objects

// build an IOT zone(equivilent to bridge) based on it's name

function IotZone( iotZoneName, iotZones ) {

  this.iotZoneName = iotZoneName;
  this.iotZoneUrl = iotZones[ iotZoneName ];

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
    }
    );
    return hueLightList;
  }
}

var steveIotZone = new IotZone( 'steve', iotZones );

function IotObject( deviceName, zone, deviceId ) {
  this.participantState = userContext.participantState;
  this.deviceName = deviceName;
  this.iotZone = zone;
  this.deviceId = deviceId;
  this.iotZoneUrl = iotZones[ this.iotZone ];
  this.geometry = new THREE.SphereGeometry( 0.2, 16, 16 );
  this.material = new THREE.MeshPhongMaterial( {
    color: 0xFCFC04,
    shininess: 66,
    opacity: 0.5,
    transparent: true
  }
  );

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
  var x, y, z;
  x = this.position.x += Math.round( Math.random() ) * 2 - 1;
  y = this.position.y += Math.round( Math.random() ) * 2 - 1;
  z = this.position.z += Math.round( Math.random() ) * 2 - 1;
  return this.position.set( x, y, z );
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
  };

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

// Frustum Object to track center of camera frustum
// - camera - a valid camera object

function FrustumObject( camera ) {
  this.camera = camera;
  this.participantState = userContext.participantState;
  this.participantState = userContext.arCapable;

  this.geometry = new THREE.SphereGeometry( 0.1, 16, 16 );
  this.material = new THREE.MeshPhongMaterial( {
    color: 0x0000ff,
    shininess: 30,
    opacity: 0.2,
    transparent: true
  }
  );

  THREE.Mesh.call( this, this.geometry, this.material );

  this.init = function( ) {
    scene.add( this.camera );
    sensorDrivenCamera.add( this );
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

function SpatialObject( data ) {
  this.geometry = new THREE.BoxGeometry( data.size[ 0 ], data.size[ 1 ], data.size[ 2 ] );
  this.material = new THREE.MeshPhongMaterial( {
    shininess: 66,
    opacity: 0.75,
    transparent: true
  }
  );

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

  threeCartesian[1] = threeCartesian[1] * -1;

  this.threeXZ = threeCartesian;

  this.init = function() {
    this.position.set( this.threeXZ[ 0 ], this.userData.dalt, this.threeXZ[ 1 ] );
  };

  this.init();
};

SpatialObject.prototype = Object.create( THREE.Mesh.prototype );
SpatialObject.prototype.constructor = SpatialObject;
SpatialObject.prototype.getMesh = function() {
  return this.mesh;
};
