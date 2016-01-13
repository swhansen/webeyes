
var setHueLightState = function( lightNo, state ) {

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

var hueLightState = function( data ) {console.log( 'lightState:', data ); };

var getHueLightState = function( lightNo ) {
    var hueURL = 'http://10.0.1.24/api/4cca312bfd9d1976814b78d491ecd8b/lights/' + lightNo ;
    $.ajax( {
    type: 'GET',
    dataType: 'json',
    url: hueURL,
    success: function( data ) { hueLightState( data ); },
    error: function( a, err ) { }
    } );
};

