
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
      t = 1000;
      $( uiStructure.structure[button].mainButton ).fadeOut( t );
      }
      document.getElementById( 'devmeButton' ).style.visibility = 'hidden';
      document.getElementById( 'modmeButton' ).style.visibility = 'visible';
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
        t = 500;
        $( uiStructure.structure[button].mainButton ).fadeOut( t );
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

  case 'vrme':

    setPeerUserContext( 'all', 'modMeState', false );
    setPeerUserContext( 'all', 'mode', 'vr');
    setPeerUserContext( 'all', 'participantState', 'peer' );

    userContext.modMeState = true;
    userContext.participantState = 'focus';
    //userContext.mode = 'vr';

    $.getJSON( '../menudescriptors/vrMeStructure.json', function( data ) {
      uiStructure = data;
    } );

    userContext.uiState = 'vr';
    userContext.addDimensionalLayer( 'arcanvaspane') ;
    emitSessionUserContext( userContext );

    for ( button in uiStructure.structure ) {
      $( uiStructure.structure[button].mainButton ).fadeOut( 1000 );
    }

    document.getElementById( 'devmeButton' ).style.visibility = 'hidden';
    document.getElementById( 'modmeButton' ).style.visibility = 'hidden';
   // document.getElementById( 'arMainButton' ).style.visibility = 'hidden';
    document.getElementById( 'vrMainButton' ).style.visibility = 'visible';
    document.getElementById( 'sticky-compass' ).style.visibility = 'hidden';
    document.getElementById( 'canvas0' ).style.pointerEvents = 'none';

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

      document.getElementById( 'devmeButton' ).style.visibility = 'hidden';
      document.getElementById( 'modmeButton' ).style.visibility = 'hidden';
      document.getElementById( 'arMainButton' ).style.visibility = 'visible';
      document.getElementById( 'sticky-compass' ).style.visibility = 'visible';
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

    break;

  case 'devme':
    $.getJSON( '../menudescriptors/devmeStructure.json', function( data ) {
      uiStructure = data;
    } );
    for ( button in uiStructure.structure ) {
      $( uiStructure.structure[button].mainButton ).fadeOut( 1000 );
    }
    document.getElementById( 'modmeButton' ).style.visibility = 'hidden';
    document.getElementById( 'devmeButton' ).style.visibility = 'visible';
    mainCollapsed = true;
  break;

  case 'iots':
    setIotZone( 'iots' );
    loadArModel( 'iot' );
    userContext.iotZone = 'iots';
    msgString = 'User ' + userContext.rtcId + ' has initalized IOT devices';
    messageBar( msgString );
  break;

  case 'iotc':
    setIotZone( 'iotc' );
    userContext.iotZone = 'iotc';
    loadArModel( 'iot' );
    msgString = 'User ' + userContext.rtcId + ' has initalized IOT devices';
    messageBar( msgString );
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

//function iotZoneModal() {
// swal( {
//    title: 'iot Zone Set',
//    text: 'Input your IOT SubZone',
//    input: 'text',
//    showCancelButton: true,
//    closeOnCancel: true,
//    closeOnConfirm: false,
//    animation: 'slide-from-top',
//    inputPlaceholder: 'IOT Sub Zone'
//      } ).then(
//        function( inputValue ) {
//          if ( inputValue === false ) return false;
//          if (inputValue === '') {
//              swal.showInputError('Please Enter a sub-zone code!');
//              return false;
//            }
//          var zoneReg =  /^([1-9][0-9]{0,2}|1000)$/;
//
//          if ( !( inputValue ).match( zoneReg ) ) {
//            swal.showInputError( 'Please enter a valid sub-zone: 1-999' );
//            return false;
//          }
//          userContext.iotSubZone = inputValue;
//          setIotSubZone( inputValue );
//          swal.close();
//          } );
//}


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
      if ( inputValue === false ) { reject( 'Please Enter  aCode!' ) }
      if (inputValue === '') { reject( 'Please Enter a Code!') }

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

function vrWorldModal() {
  swal({
    title: 'Select a AR World',
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
          setArWorld();
          shareArVrWorld();
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

function helpModal() {
  console.log( 'at helpModal' );
swal({
  title: '<i>WEBEYES plus-up codes</i>',
  type: 'question',
  width: '700px',
  html:
'<ul>' +
'<li><b>modme: </b> participant controls centering of all participants video</li>' +
'<li><b>clearmodme: </b> clears moderator privledges</li>' +
'<li><b>augme: </b> augmented reality mode, requires sensor enabled device</li> ' +
'<li><b>vrme: </b> virtual reality mode, moderator controls world locally</li>' +
'<li><b>iots, iotc: </b> set the IOT zone</li>' +
'<li><b> iotz: </b> set the IOT sub-zone; int( 1-999 )</li>' +
'<li><b> leapme: </b> initialized the Leap Motion hands, reqiores Leap sensor</li>' +
'<li><b>leapgrabon, leapgraboff: </b> toggel Leap hand IOT interaction</li>' +
'</ul>' +

    'You can use <b>bold text</b>, ' +
    '<a href="//github.com">links</a> ' +
    'and other HTML tags',
  showCloseButton: true,
})
}




// UI code input dialog

$( '#codeDialogModal' ).dialog( {
        autoOpen: false
    } );

//$( '#codeDialogButton' ).click( function() {
// swal( {
//   title: 'Plus-up Code',
//   text: 'Input your Super Secret Code',
//   input: 'text',
//   showCancelButton: true,
//   closeOnCancel: true,
//   closeOnConfirm: false,
//   animation: 'slide-from-top',
//   inputPlaceholder: 'Plus-up Code',
//     } ).then(
//       function(inputValue){
//         if ( inputValue === false ) return false;
//         if ( inputValue.toLowerCase() === 'augme' && userContext.arCapable === false) {
//           swal('Oops... Not an AR Capable Device', 'Use a orientation and location aware device', 'error' );
//         } else {
//           if (inputValue === '') {
//             swal.showInputError('Please Enter Code!');
//             return false;
//           }
//          else
//           if ( !( _.includes( [ 'devme', 'modme', 'augme', 'vrme', 'iots', 'iotc', 'leapme', 'iotz', 'clearmodme', 'leapgrabon', 'leapgraboff' ],
//             inputValue.toLowerCase() ) ) ) {
//               swal.showInputError( 'Please enter a valid code' );
//             return false;
//         }
//            if ( _.includes( [ 'devme', 'modme', 'augme', 'vrme', 'iots', 'iotc', 'leapme', 'iotz', 'clearmodme', 'leapgrabon', 'leapgraboff' ],
//             inputValue.toLowerCase() ) ) {
//               if ( inputValue.toLowerCase() === 'iotz' ) {
//                 useModeCode( inputValue.toLowerCase() );
//               }  else
//               if ( inputValue.toLowerCase() === 'vrme' ) {
//                 useModeCode( inputValue.toLowerCase() );
//               }
//               else
//               if ( inputValue.toLowerCase() === 'augme' ) {
//                 useModeCode( inputValue.toLowerCase() );
//               }
//             else {
//               swal.close();
//               useModeCode( inputValue.toLowerCase() );
//               }
//             }
//           }
//     }
//     );
// } );

var plusupCodeArray =  [ 'help', 'devme', 'modme', 'augme', 'vrme', 'iots', 'iotc', 'leapme', 'iotz', 'clearmodme', 'leapgrabon', 'leapgraboff' ];

$( '#codeDialogButton' ).click( function() {
  swal( {
    title: 'Enter your super secret code',
    input: 'text',
    showCancelButton: true,
    confirmButtonText: 'Submit',
    showLoaderOnConfirm: true,
    preConfirm: function ( inputValue) {
      return new Promise(function (resolve, reject) {
      setTimeout(function() {
      if ( inputValue === false ) return false;
        if ( inputValue.toLowerCase() === 'augme' && userContext.arCapable === false) {
           reject('Oops... Not an AR Capable Device', 'Use a orientation and location aware device');
         } else {
           if (inputValue === '') {
             reject('Please Enter Code!');
             return false;
           }
          else
           if ( !( _.includes( plusupCodeArray,
             inputValue.toLowerCase() ) ) ) {
               reject( 'Please enter a valid code' );
             return false;
         }
            if ( _.includes( plusupCodeArray,
             inputValue.toLowerCase() ) ) {
               if ( inputValue.toLowerCase() === 'iotz' ) {
                 useModeCode( inputValue.toLowerCase() );
               }  else
               if ( inputValue.toLowerCase() === 'vrme' ) {
                 useModeCode( inputValue.toLowerCase() );
               }
               else
               if ( inputValue.toLowerCase() === 'augme' ) {
                 useModeCode( inputValue.toLowerCase() );
               }
               if ( inputValue.toLowerCase() === 'help' ) {
                 useModeCode( inputValue.toLowerCase() );
               }
             else {
               resolve();
               useModeCode( inputValue.toLowerCase() );
               }
             }
           }
      }, 10);
    } );
  },
    allowOutsideClick: false
    } );
} );


// recieving unique rtcID

socketServer.on( 'focus', function( id ) {
  //console.log('at button-code - socketServer Recieved rtcID:', id);
   focusUser( id );
  }
 );