
//   Functions for execution of the 'mod-code'

// function initModme() {
//
// $( function() {
//   $( '#focus-participant' ).tooltip( {
//       content: 'Select a participant box to focus',
//       track:true
//     } );
//   } );
//
// modmeUI();

//`setDomPointerEvent('canvas0', 'none');
//}

'use strict';

function useModeCode( modeCode ) {
  var mainCollapsed;
  switch ( modeCode ) {

   case 'modme':
    setPeerUserContext( 'all', 'modMeState', false );
    userContext.modMeState = true;
    statusBox.updateElement( 'ismoderator', '' );
    $( '#ismoderator' ).text( 'moderator' );
    emitSessionUserContext( userContext );

    $.getJSON( '../menudescriptors/modmeStructure.json', function( data ) {
      uiStructure = data;
      } );
      for ( var button in uiStructure.structure ) {
      $( uiStructure.structure[button].mainButton ).fadeOut( 1000 );
      }
      mainCollapsed = true;
    break;


    case 'clearmodme':
      setPeerUserContext( 'all', 'modMeState', false );
      userContext.modMeState = false
      statusBox.updateElement( 'ismoderator', '' );
      emitUtility( 'clearmoderator' );
    break;

    case 'leapme':
    userContext.isLeap = true;
    leapFocus();

  // Tell everyone to initialize Leap

    var sessionId = socketServer.sessionid;
    socketServer.emit( 'utility', 'leapClientInit', sessionId );

     mainCollapsed = true;
      for ( var button in uiStructure.structure ) {
        $( uiStructure.structure[button].mainButton ).fadeOut( 500 );
      }

      userContext.addDimensionalLayer( 'arcanvaspane' );

    msgString = 'User ' + userContext.rtcId + ' has become iniialized Leap';
    messageBar( msgString );

    break;

    case 'leapgraboff':
      isIotGrabOn = false;
    break;

    case 'leapgrabon':
      isIotGrabOn = true;
    break;

    case 'placear':
    console.log( 'at dropar' );
      placeArObjModal();
    break;

  case 'vrme':

   console.log( 'at vrme' );

    setPeerUserContext( 'all', 'modMeState', false );
    setPeerUserContext( 'all', 'mode', 'vr');
    setPeerUserContext( 'all', 'participantState', 'peer' );

    userContext.modMeState = true;
    userContext.participantState = 'focus';
    userContext.uiState = 'vr';


  //  $.getJSON( '../menudescriptors/vrMeStructure.json', function( data ) {
  //    uiStructure = data;
  //  } );

    userContext.addDimensionalLayer( 'arcanvaspane') ;

// for API

    emitSessionUserContext( userContext );

    for ( button in uiStructure.structure ) {
      $( uiStructure.structure[button].mainButton ).fadeOut( 1000 );
    }
 //   document.getElementById( 'canvas0' ).style.pointerEvents = 'none';

    mainCollapsed = true;

// Focus the AR initiator (modme)

      var sessionId = socketServer.sessionid;
      socketServer.emit( 'focus', userContext.rtcId, sessionId );

    var msgString = 'User ' + userContext.rtcId + ' has become the focus in VR mode';
    emitMessage( msgString );

    vrWorldModal();

    emitUtility( 'clearmoderator' );

    $( '#ismoderator' ).text( 'Moderator' );

  break;

  case 'sphereme':
    sphereVrModal();
  break;

  case 'removevrtest':
    removeSphericalVr();
  break;

  case 'augme':

      setPeerUserContext( 'all', 'modMeState', false );
      setPeerUserContext( 'all', 'mode', 'ar');
      setPeerUserContext( 'all', 'participantState', 'peer' );

      userContext.modMeState = true;
      userContext.participantState = 'focus';
      emitSessionUserContext( userContext );

      $.getJSON( '../menudescriptors/augMeStructure.json', function( data ) {
          uiStructure = data;
        } );

      for ( button in uiStructure.structure ) {
          $( uiStructure.structure[button].mainButton ).fadeOut( 1000 );
        }

      mainCollapsed = true;

      // Focus the AR initiator (modme)

      var sessionId = socketServer.sessionid;
          socketServer.emit( 'focus', userContext.rtcId, sessionId );

      msgString = 'User ' + userContext.rtcId + ' has become the focus in AR mode';
      emitMessage( msgString );

      arWorldModal();

      emitUtility( 'clearmoderator' );
      $( '#ismoderator' ).text( 'Moderator' );

      emitArOrientationData();

    //  orientationCompass( true );

    break;

  case 'devme':
    $.getJSON( '../menudescriptors/devmeStructure.json', function( data ) {
      uiStructure = data;
    } );
    for ( button in uiStructure.structure ) {
      $( uiStructure.structure[button].mainButton ).fadeOut( 1000 );
    }
//    document.getElementById( 'modmeButton' ).style.visibility = 'hidden';
//    document.getElementById( 'devmeButton' ).style.visibility = 'visible';
    mainCollapsed = true;
  break;

  case 'iots':
    setIotZone( 'iots' );
    loadArModel( 'iot' );
    userContext.iotZone = 'iots';
    msgString = 'User ' + userContext.rtcId + ' has initalized IOT devices';
    messageBar( msgString );

    hueSetAllLightsXY( false );

  break;

  case 'iotc':
    setIotZone( 'iotc' );
    userContext.iotZone = 'iotc';
    loadArModel( 'iot' );
    msgString = 'User ' + userContext.rtcId + ' has initalized IOT devices';
    messageBar( msgString );

    hueSetAllLightsXY( false );

  break;

  case 'iotz':
    iotZoneModal();
  break;

  case 'help':
  console.log('at case helpModal' );
    helpModal();
  break;
  }
}

// ------- end plus-up case -------------------------

//function placeArObjModal() {
//swal( {
//  title: 'AR Object Name',
//  input: 'text',
//  confirmButtonText: 'Submit',
//  inputPlaceholder: 'Your AR object Name',
//  showCancelButton: true,
//  }).then(function (text) {
//  if ( text ) {
//    createArObject( text );
//  }
//});


async function placeArObjModal() {
const { value: name } = await swal( {
  title: 'AR Obj Name?',
  input: 'text',
  inputPlaceholder: 'an AR object name',
  showCancelButton: true,
  inputValidator: function ( value ) {
    return !value && 'You need to write something!';
  }
} );
if ( name ) {
  createArObject( name );
}
}

function iotZoneModal() {
  swal( {
    title: 'Enter your sub-zone',
    input: 'text',
    showCancelButton: true,
    confirmButtonText: 'Submit',
    showLoaderOnConfirm: true,
    preConfirm: function ( inputValue) {
      return new Promise( function ( resolve, reject ) {
      setTimeout(function() {
      if ( inputValue === false ) { reject( 'Please Enter Code!' ); }
      if (inputValue === '') { reject( 'Please Enter a Code!'); }

        var zoneReg =  /^([1-9][0-9]{0,2}|1000)$/;
        if ( !( inputValue ).match( zoneReg ) ) {
            reject ( 'Please enter a valid sub-zone: 1-999' );
          } else {
            userContext.iotSubZone = inputValue;
            setIotSubZone( inputValue );
            resolve();
          }
        }, 10);
    } );
    } }
    );
}

function sphereVrModal() {
  swal( {
      title: 'Select a PhotoSphere',
      text: 'Load a sphere from your local device',
      input: 'file',
      showCancelButton: true,
      inputAttributes: {
        accept: 'image/*'
      }
      } ).then( function ( file ) {
        var reader = new FileReader();
        reader.onload = function ( e ) {
          sphericalVr( e.target.result );
      };
    reader.readAsDataURL( file );
  } );
}

function vrWorldModal() {
  swal( {
    title: 'Select a VR World',
    input: 'select',
    inputOptions: {
      'steve': 'steve',
      'chuck': 'chuck',
      'test': 'test'
    },
    inputPlaceholder: 'Select a VR World',
    showCancelButton: true,
    inputValidator: function (inputValue) {
      return new Promise(function (resolve, reject) {
        setVrWorld();
        shareArVrWorld();
    //var sessionId = socketServer.sessionid;
    // socketServer.emit( 'focus', userContext.rtcId, sessionId );
          statusBox.updateElement( 'metaverse', inputValue );
          resolve();
        }
      );
    }
  } ).then(function (result) {
    swal( {
      type: 'success',
      html: 'Your entering ' + result + ' world...Enjoy'
      } );
    } );
}

function arWorldModal() {
  swal({
    title: 'Select a AR World',
    input: 'select',
    inputOptions: {
      'steve': 'steve',
      'chuck': 'chuck',
      'test': 'test'
    },
    inputPlaceholder: 'Select a AR World',
    showCancelButton: true,
    inputValidator: function (inputValue) {
      return new Promise(function (resolve, reject) {
          userContext.modMeState = true;
          userContext.participantState = 'focus';
          userContext.uiState = 'vr';
          statusBox.updateElement( 'metaverse', inputValue );
          setArWorld();
          shareArVrWorld();
          resolve();
        }
      );
    }
  } ).then(function (result) {
    swal( {
      type: 'success',
      html: 'Your entering ' + result + ' world...Enjoy'
      } );
    } );
}

function helpModal() {
  swal({
    title: '<i>WEBEYES plus-up codes</i>',
    type: 'info',
    width: '700px',
    html:
  '<ul>' +
  '<li><b>modme: </b> participant controls centering of all participants video</li>' +
  '<li><b>clearmodme: </b> clears moderator privledges</li>' +
  '<li><b>augme: </b> augmented reality mode, requires sensor enabled device</li> ' +
  '<li><b>vrme: </b> virtual reality mode, moderator controls world locally</li>' +
  '<li><b>iots, iotc: </b> set the IOT zone. <b>note:</b> must be preceded by a vrme/augme</li>' +
  '<li><b> iotz: </b> set the IOT sub-zone; int( 1-999 )</li>' +
  '<li><b> leapme: </b> initialized the Leap Motion hands, reqiores Leap sensor</li>' +
  '<li><b>leapgrabon, leapgraboff: </b> toggel Leap hand IOT interaction</li>' +
  '</ul>' +
  'You can use find more info at, ' +
  '<a href="//blablabla.com">links</a> ',
    showCloseButton: true,
  })
}

// UI code input dialog

$( '#codeDialogModal' ).dialog( {
        autoOpen: false
    } );

var modalMultiple =  [ 'placear', 'help', 'sphereme', 'augme', 'vrme',  'iotz' ];
var plusupCodeArray = [ 'placear', 'removevrtest', 'sphereme', 'help',  'augme', 'vrme',  'iotz', 'modme', 'iots', 'iotc', 'leapme',  'clearmodme', 'leapgrabon', 'leapgraboff'];

$( '#codeDialogButton' ).click( function() {
  swal( {
    title: 'Enter your super secret code',
    input: 'text',
    showCancelButton: true,
    confirmButtonText: 'Submit',
    showLoaderOnConfirm: true,
    preConfirm: function ( inputValue) {
      return new Promise(function (resolve, reject) {
        if ( inputValue === false ) { reject('Please Enter Code!'); }
        if (inputValue === '') { reject( 'Please Enter Code!' ); }
        if ( inputValue.toLowerCase() === 'augme' && userContext.arCapable === false) {
           reject( 'Oops... Not an AR Capable Device', 'Use a orientation and location aware device' ); }
        if ( !( _.includes( plusupCodeArray, inputValue.toLowerCase() ) ) ) {
              reject( 'Please enter a valid code - hint: enter help' ); }
        if ( ( _.includes( modalMultiple, inputValue.toLowerCase() ) )  ) {
            useModeCode( inputValue.toLowerCase() );
          } else {
            useModeCode( inputValue.toLowerCase() );
            resolve();
            }
        } );
      }
    } );
} );

// recieving unique rtcID

socketServer.on( 'focus', function( id ) {
  //console.log('at button-code - socketServer Recieved rtcID:', id);
   focusUser( id );
  }
 );