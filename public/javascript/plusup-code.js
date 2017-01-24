
//   Functions for execution of the 'mode-code'

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

function useModeCode( modeCode ) {
  var mainCollapsed;
  switch ( modeCode ) {

   case 'modme':

    setPeerUserContext( 'all', 'modMeState', false );

    userContext.modMeState = true;
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

      emitUtility( 'clearmoderator' );
      $( '#ismoderator' ).text( 'Moderator' );

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
  }
}
// ------- end plus-up case -------------------------

function iotZoneModal() {
 swal( {
    title: 'iot Zone Set',
    text: 'Input your IOT SubZone',
    type: 'input',
    showCancelButton: true,
    closeOnCancel: true,
    closeOnConfirm: false,
    animation: 'slide-from-top',
    inputPlaceholder: 'IOT Sub Zone'
      },
        function( inputValue ) {
          if ( inputValue === false ) return false;
          if (inputValue === '') {
              swal.showInputError('Please Enter a sub-zone code!');
              return false;
            }
          var zoneReg =  /^([1-9][0-9]{0,2}|1000)$/;

          if ( !( inputValue ).match( zoneReg ) ) {
            swal.showInputError( 'Please enter a valid sub-zone: 1-999' );
            return false;
          }
          userContext.iotSubZone = inputValue;
          setIotSubZone( inputValue );
          swal.close();
          } );
}

function vrWorldModal() {
swal( {
     title: 'VR World',
     text: 'Input your VR World',
     type: 'input',
     showCancelButton: true,
     closeOnCancel: true,
     closeOnConfirm: false,
     animation: 'slide-from-top',
     inputPlaceholder: 'VR World'
       },
         function( inputValue ) {
           if ( inputValue === false ) { return false; }
           if ( inputValue === '' ) {
               swal.showInputError( 'Please Enter Your VR World!' );
               return false;
             }
            if ( !( _.includes( [ 'steve', 'chuck', 'test' ],
               inputValue.toLowerCase() ) ) ) {
                 swal.showInputError( 'Please enter a valid VR World' );
               return false; } userContext.arvrWorld = inputValue.toLowerCase();
          emitSessionUserContext( userContext );
          swal.close();

          setVrWorld();
          shareArVrWorld();

          $( '#vrMainButton' ).css( 'visibility', 'hidden' );
          $( '#ar-radial-menu' ).css( 'visibility', 'visible' );
    } );
}

function arWorldModal() {
  swal( {
     title: 'AR World',
     text: 'Input Your AR World',
     type: 'input',
     showCancelButton: true,
     closeOnCancel: true,
     closeOnConfirm: false,
     animation: 'slide-from-top',
     inputPlaceholder: 'AR World'
       },
         function( inputValue ) {
           if ( inputValue === false ) { return false; }
           if ( inputValue === '' ) {
               swal.showInputError( 'Please Enter Your AR World!' );
               return false;
             }
           if ( !( _.includes( [ 'steve', 'chuck', 'test' ],
               inputValue.toLowerCase() ) ) ) {
                 swal.showInputError( 'Please enter a valid AR World' );
               return false;
           }
          userContext.arvrWorld = inputValue.toLowerCase();
          emitSessionUserContext( userContext );
          swal.close();
          setArWorld();
          shareArVrWorld();
          $( '#arMainButton' ).css( 'visibility', 'hidden' );
          $( '#ar-radial-menu' ).css( 'visibility', 'visible' );
    } );
}


// UI code input dialog

$( '#codeDialogModal' ).dialog( {
        autoOpen: false
    } );

 $( '#codeDialogButton' ).click( function() {
  swal( {
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
          if ( inputValue === false ) return false;
          if ( inputValue.toLowerCase() === 'augme' && userContext.arCapable === false) {
            swal('Oops... Not an AR Capable Device', 'Use a orientation and location aware device', 'error' );
          } else {
            if (inputValue === '') {
              swal.showInputError('Please Enter Code!');
              return false;
            }
           else
            if ( !( _.includes( [ 'devme', 'modme', 'augme', 'vrme', 'iots', 'iotc', 'leapme', 'iotz' ],
              inputValue.toLowerCase() ) ) ) {
                swal.showInputError( 'Please enter a valid code' );
              return false;
          }
             if ( _.includes( [ 'devme', 'modme', 'augme', 'vrme', 'iots', 'iotc', 'leapme', 'iotz' ],
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
              else {
                swal.close();
                useModeCode( inputValue.toLowerCase() );
                }
              }
            }
      } );
} );


// recieving unique rtcID

socketServer.on( 'focus', function( id ) {
  //console.log('at button-code - socketServer Recieved rtcID:', id);
   focusUser( id );
  }
 );