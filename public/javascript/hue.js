
var hueURL = 'http://10.0.1.2/api/4cca312bfd9d1976814b78d491ecd8b';

var hueLightState;
var hueLightList;
var hueLightListLength;

var hueSetLightState = function( lightNo, state, hue, sat, bri ) {
    var dataObject =  {};
    dataObject.on = state;
    dataObject.hue = hue;
    dataObject.sat = sat;
    dataObject.bri = bri;
    var URL = hueURL + '/lights/' + lightNo + '/state';
    $.ajax( {
    type: 'PUT',
    dataType: 'json',
    url: URL,
    data: JSON.stringify( dataObject ),
    error: function( a, err ) { }
    } );
};

var alertWeg2rtEntry = function( lightNo ) {
    var URL = hueURL + '/lights/' + lightNo + '/state';
    var dataObject = {};
    dataObject.alert = 'lselect';
    $.ajax( {
    type: 'PUT',
    dataType: 'json',
    url: URL,
    data: JSON.stringify( dataObject ),

//    success: function( data ) { console.log( data ); },

    error: function( a, err ) { }
    } );
};

// var hueLightState = function( data ) {
//   console.log( 'lightState:', data );
//   return ( data  );
// };

// get the state of a specific light

var hueGetLightState = function( lightNo ) {
    var URL = hueURL + '/lights/' + lightNo ;
    var lightState = $.ajax( {
    type: 'GET',
    dataType: 'json',
    url: URL
  } );
    lightState.done( function( data ) {
      hueLightState = data;
    }
    );
  };

// get the state of all lights

var hueGetAllLights = function() {
    var URL = hueURL + '/lights/';
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
  };

hueGetAllLights();

var hueSetAllLights = function( state ) {
  for ( i = 1; i < hueLightListLength + 1; ++i ) {
    hueSetLightState( i, state );
  }
};


function xyBriToRgb(x, y, bri){
            z = 1.0 - x - y;
            Y = bri / 255.0; // Brightness of lamp
            X = (Y / y) * x;
            Z = (Y / y) * z;
            r = X * 1.612 - Y * 0.203 - Z * 0.302;
            g = -X * 0.509 + Y * 1.412 + Z * 0.066;
            b = X * 0.026 - Y * 0.072 + Z * 0.962;
            r = r <= 0.0031308 ? 12.92 * r : (1.0 + 0.055) * Math.pow(r, (1.0 / 2.4)) - 0.055;
            g = g <= 0.0031308 ? 12.92 * g : (1.0 + 0.055) * Math.pow(g, (1.0 / 2.4)) - 0.055;
            b = b <= 0.0031308 ? 12.92 * b : (1.0 + 0.055) * Math.pow(b, (1.0 / 2.4)) - 0.055;
            maxValue = Math.max(r,g,b);
            r /= maxValue;
            g /= maxValue;
            b /= maxValue;
            r = r * 255;   if (r < 0) { r = 255 };
            g = g * 255;   if (g < 0) { g = 255 };
            b = b * 255;   if (b < 0) { b = 255 };
            return {
                r :r,
                g :g,
                b :b
            }
        }
