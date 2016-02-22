
var hueURL = 'http://10.0.1.2/api/4cca312bfd9d1976814b78d491ecd8b';

var setHueLightState = function( lightNo, state ) {

    var dataObject =  {};
    dataObject.on = state;
    var URL = hueURL + '/lights/' + lightNo + '/state';

    $.ajax( {
    type: 'PUT',
    dataType: 'json',
    url: URL,
    data: JSON.stringify( dataObject ),
    success: function( data ) { console.log( data ); },
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
    success: function( data ) { console.log( data ); },
    error: function( a, err ) { }
    } );
};

var hueLightState = function( data ) { return data; };

var getHueLightState = function( lightNo ) {
    var URL = hueURL + '/lights/' + lightNo ;
    $.ajax( {
    type: 'GET',
    dataType: 'json',
    url: URL,
    success: function( data ) { hueLightState( data ); },
    error: function( a, err ) { }
    } );
};

