
//
//   Functions for execution of the 'button-code'
// Button codes are user to invoke functions that are restricted
//  - invoked through the + main menu button
//  - pulls in a specific menudescriptor JSON file
//

function initModme() {

$( function() {
  $( '#focus-participant' ).tooltip( {
      content: 'Select a participant box to focus',
      track:true
    } );
  } );

modmeUI();
setDomPointerEvent('canvas0', 'none');
}

function usebcode( bcode ) {
  var mainCollapsed;
  switch ( bcode )
  {
   case 'modme':

setPeerUserContext( 'all', 'modMeState', false );

// insert rets and checks for self rtcid

userContext.modMeState = true;

   userContext.modMeState = true;
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

    userContext.uistate = 'vr';

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

    break;

    case 'augme':

    console.log( 'userContext:', userContext);

      setPeerUserContext( 'all', 'modMeState', false );
      setPeerUserContext( 'all', 'mode', 'ar');
      setPeerUserContext( 'all', 'participantState', 'peer' );

      userContext.modMeState = true;
      userContext.participantState = 'focus';

      $.getJSON( '../menudescriptors/augMeStructure.json', function( data ) {
          uiStructure = data;
        } );

      for ( button in uiStructure.structure ) {
          $( uiStructure.structure[button].mainButton ).fadeOut( 1000 );
        }

      //userContext.mode = 'ar';
      //userContext.modMeState = true;

      document.getElementById( 'devmeButton' ).style.visibility = 'hidden';
      document.getElementById( 'modmeButton' ).style.visibility = 'hidden';
      document.getElementById( 'arMainButton' ).style.visibility = 'visible';
      document.getElementById( 'sticky-compass' ).style.visibility = 'visible';
      mainCollapsed = true;

      // Focus the AR initiator (modme)

      var sessionId = socketServer.sessionid;
          socketServer.emit( 'focus', userContext.rtcId, sessionId );

      // Tell everyone to initialize AR

        // var sessionId = socketServer.sessionid;
      //        socketServer.emit( 'utility', 'arClientInit', sessionId );

      msgString = 'User ' + userContext.rtcId + ' has become the focus in AR mode';
      emitMessage( msgString );

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
    msgString = 'User ' + userContext.rtcId + ' has initalized IOT devices';
    messageBar( msgString );
  break;

  case 'iotc':
    setIotZone( 'iotc' );
    msgString = 'User ' + userContext.rtcId + ' has initalized IOT devices';
    messageBar( msgString );
  break;
  }
}

// UI code input dialog

$( '#codeDialogModal' ).dialog( {
        autoOpen: false
    } );

 $( '#codeDialogButton' ).click( function() {
  swal({
    title: 'Button Code',
    text: 'Input your Super Secret Code',
    type: 'input',
    showCancelButton: true,
    closeOnCancel: true,
    closeOnConfirm: false,
    animation: 'slide-from-top',
    inputPlaceholder: 'Button Code'
      },
        function(inputValue){
          if (inputValue === false) return false;

          if ( inputValue.toLowerCase() === 'augme' && userContext.arCapable === false) {
            swal('Oops... Not an AR Capable Device', 'Use a orientation and location aware device', 'error' );
          } else {
            if (inputValue === '') {
              swal.showInputError('Please Enter Code!');
              return false;
            }
           else if ( !( _.includes( [ 'devme', 'modme', 'augme', 'vrme', 'iots', 'iotc' ],
              inputValue.toLowerCase() ) ) ) {
                swal.showInputError( 'Please enter a valid code' );
              return false;
          }
         usebcode( inputValue.toLowerCase() );
         swal.close();
       }

  } );
} );

 function notAr() {
swal( 'Oops... Not AR Capable Device',
      'Please use a orientation and location based device',
      'error'
   );

 }

// recieving unique rtcID

socketServer.on( 'focus', function( id ) {
  //console.log('at button-code - socketServer Recieved rtcID:', id);
   focusUser( id );
  }
 );