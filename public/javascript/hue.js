
//var hueURL = 'http://10.0.1.24/api/4cca312bfd9d1976814b78d491ecd8b/lights/1/state';
//
//var dataObject = { 'on':true, 'hue': 44560 };
//
//var dataObject = { 'on':false, 'hue': 44560 };

var hueLightState = function( lightNo, state) {

    var dataObject =  {};
    dataObject.on = state;
    var hueURL = 'http://10.0.1.24/api/4cca312bfd9d1976814b78d491ecd8b/lights/' + lightNo + '/state';

    $.ajax( {
    type: 'PUT',
    dataType: 'json',
    url: hueURL,
    data: JSON.stringify( dataObject ),
    success: function( data ) { },
    error: function( a, err ) { }
    } );
};
