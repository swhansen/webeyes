
var setHueLightState = function( lightNo, state) {

    var dataObject =  {};
    dataObject.on = state;
    var hueURL = 'http://10.0.1.24/api/4cca312bfd9d1976814b78d491ecd8b/lights/' + lightNo + '/state';

    $.ajax( {
    type: 'PUT',
    dataType: 'json',
    url: hueURL,
    data: JSON.stringify( dataObject ),
    success: function( data ) { console.log( data ); },
    error: function( a, err ) { }
    } );
};

var alertWeg2rtEntry = function() {
    var hueURL = 'http://10.0.1.24/api/4cca312bfd9d1976814b78d491ecd8b/lights/2/state';
    var dataObject = {};
    dataObject.alert = 'lselect';
    $.ajax( {
    type: 'PUT',
    dataType: 'json',
    url: hueURL,
    data: JSON.stringify( dataObject ),
    success: function( data ) { console.log( data ); },
    error: function( a, err ) { }
    } );
};

var getHueLightState = function( lightNo ) {

    var hueURL = 'http://10.0.1.24/api/4cca312bfd9d1976814b78d491ecd8b/lights/' + lightNo ;
    $.ajax( {
    type: 'GET',
    dataType: 'json',
    url: hueURL,
    success: function( data ) { console.log( data ); console.log(data.state.bri); },
    error: function( a, err ) { }
    } );
};

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}