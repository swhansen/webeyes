//
//  Declare the high level UI Structure
//    - Must be valid JSON
//    - Main function buttons (left menu)
//    - Function detail buttons (right menu)visability

//  mainButton: button in main menu
//  sideBar: container for the layer function button list (re-name??)
//  buttons: button list in the layer menu
//

function initUiManager() {

// var uiStructure = {};
var mainCollapsed = true;
var modSwitch = false;
var msgString;

// initialize the core menu

$.getJSON( '../menudescriptors/coreStructure.json', function( data ) {
  uiStructure = data;
} );

var videoMuteData = {};
var thisBox;

//function setDomPointerEvent( domId, mode ) {
//  document.getElementById( domId ).style.pointerEvents = mode;
//}

function setLayerPointerExclusive( layer ) {
  _.forEach( layerList, function( key ) {
     document.getElementById( key ).style.pointerEvents = 'none';
    } );
  document.getElementById( layer ).style.pointerEvents = 'auto';
  captureLayerPointerState();
}

function getLayersPointerStatus() {
  var obj = {};
 _.forEach( layerList, function( key ) {
    obj[ key ] = document.getElementById( key ).style.pointerEvents;
  } );
    return obj;
}

function captureLayerPointerState() {
  _.forEach( layerList, function( key ) {
    layerPointerState[ key ] = document.getElementById( key ).style.pointerEvents;
  } );
}

function setLayersPointerFromState() {
  _.forEach( layerPointerState, function( value, key ) {
      document.getElementById( key ).style.pointerEvents = key.value;
  } );
}

function getLayersZindexStatus() {
  var obj = {};
  _.forEach( layerList, function( key ) {
    var elem = document.getElementById( key );
    var theCSSprop = window.getComputedStyle( elem, null ).getPropertyValue( 'z-index' );
    obj[ key ] = theCSSprop;
  } );
  return obj;
}

// list z-indexes

//( '*' ).filter( function() {
//  return $( this ).css( 'z-index' ) >= 10;
//} ).each( function() {
//  console.log( 'z-index:', $( this ), 'is:', $( this ).css( 'z-index' ) );
//} );

// captureLayerPointerState( layerList );
// console.log( 'pointerState:', layerPointerState );
//
// setDomPointerEvent( 'fullpage', 'auto' );
// console.log( 'pointerStatus:', getLayersPointerStatus() );
//
//  setLayersPointerFromState();
//  console.log( 'pointerStatus:', getLayersPointerStatus() );

// //setLayersPointerFromState();
// setLayerPointerExclusive( 'utilcanvaspane');
// console.log( 'set to canvas pane - layerPointerState:', layerPointerState );
// console.log( 'pointerState- getLayersPointerStatus:', getLayersPointerStatus() );
//
// console.log( 'Layer z-index:', getLayersZindexStatus() );

// setLayerPointerExclusive( 'canvaspane' );
// console.log( 'canvas - PointerMode:', getLayersPointerStatus() );
// setLayerPointerExclusive( 'fullpage' );
// console.log( 'fullpage - PointerMode:', getLayersPointerStatus() );

//
// Sticky menus
//

$( function() {
$( '#sticky-draw' ).click( function() {
    _.each( uiStructure.structure, function( fcn ) {
    $( fcn.sideBar ).fadeOut( 2 );
  } );

  document.getElementById( 'canvaspane' ).style.zIndex = '50';
  document.getElementById( 'arcanvaspane' ).style.zIndex = '10';

  //moveLayertoTop( 'canvaspane' );

  setDomPointerEvent( 'canvas0', 'auto' );
  setDomPointerEvent( 'arcanvaspane', 'none' );

  messageBar( 'Draw Layer is in Focus' );
 } );
  } );

$( function() {
  $( '#sticky-ar' ).click( function() {

  //  _.each( uiStructure.structure, function( fcn ) {
  //     $( fcn.sideBar ).fadeOut( 2 );
  //    } );

   document.getElementById( 'canvaspane' ).style.zIndex = '10';
   document.getElementById( 'arcanvaspane' ).style.zIndex = '50';

     setDomPointerEvent( 'canvas0', 'none' );
     setDomPointerEvent( 'arcanvaspane', 'auto' );
     messageBar( 'AR Layer is in Focus' );
  } );
} );

// Toggle the leap hand to control IOT

$( function() {
  $( '#sticky-handiot' ).click( function() {
    if ( isIotGrabOn === true ) {
      document.getElementById( 'sticky-handiot' ).src = 'img/hand.png';
      isIotGrabOn = false;
    } else {
      document.getElementById( 'sticky-handiot' ).src = 'img/handiot.png';
      isIotGrabOn = true;
    }
  } );
} );

$( function() {
  $( '#sticky-compass' ).click( function() {
    compassToggle = !compassToggle;
    var data = compassToggle;
    orientationCompass( data );
    var sessionId = socketServer.sessionid;
    socketServer.emit( 'toggleCompass', data, sessionId );
  } );
} );

function buildSideMenu( layer ) {

  // remove existing side menu(s)
  // expand right element div and buttons for function specific menu
  // collapse main menu

  _.each( uiStructure.structure, function( fcn ) {
    $( fcn.sideBar ).fadeOut( 2 );
  } );

  $( '#layer-menu-button' ).trigger( 'click' );

  $( uiStructure.structure[layer].sideBar ).fadeIn( 5 );

  _.each( uiStructure.structure[layer].buttons, function( button ) {
    $( button ).fadeIn( 2000 );
  } );
}

// the main menu collapse-expand

$( document ).ready( function() {
  var t = 500;
  $( '#layer-menu-button' ).click( function() {
    var button;
    if ( mainCollapsed === true ) {
      mainCollapsed = false;
      for ( button in uiStructure.structure ) {
        $( uiStructure.structure[button].mainButton ).fadeIn( t );
      }
    } else {
      mainCollapsed = true;
      for ( button in uiStructure.structure ) {
        t = 500;
        $( uiStructure.structure[button].mainButton ).fadeOut( t );
      }
    }
  } );
} );

$( function() {
  $( '#leapButton' ).click( function() {
    userContext.isLeap = true;
    document.getElementById( 'sticky-handiot' ).style.visibility = 'visible';
    leapFocus();

  // Tell everyone to initialize Leap

  var sessionId = socketServer.sessionid;
      socketServer.emit( 'utility', 'leapClientInit', sessionId );

    msgString = 'User ' + userContext.rtcId + ' has become iniialized Leap';
    messageBar( msgString );

    mainCollapsed = true;
      for ( var button in uiStructure.structure ) {
        t = 500;
        $( uiStructure.structure[button].mainButton ).fadeOut( t );
      }
    }
  );
} );

$( function() {
  $( '#utilButton' ).click( function() {
    buildSideMenu( 'util' );
    userContext.addDimensionalLayer( 'utilcanvaspane' );
    }
  );
} );

$( function() {
  $( '#drawButton' ).click( function() {
      buildSideMenu( 'draw' );
      userContext.uiState = 'draw';
      setDomPointerEvent( 'arcanvaspane', 'none' );
      setDomPointerEvent( 'canvas0', 'auto' );
      setDomPointerEvent( 'arcanvaspane', 'none' );
    }
  );
} );

$( function() {
  $( '#modmeButton' ).click( function() {
      buildSideMenu( 'modme' );
      userContext.modMeState = true;
      setDomPointerEvent( 'canvas0', 'none' );
      setDomPointerEvent( 'arcanvaspane', 'none' );
    }
  );
} );

$( function() {
  $( '#arMainButton' ).click( function() {
   swal( {
   title: 'AR World',
   text: 'Input Your VR World',
   type: 'input',
   showCancelButton: true,
   closeOnCancel: true,
   closeOnConfirm: false,
   animation: 'slide-from-top',
   inputPlaceholder: 'AR VR World'
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
        $( '#arMainButton' ).css( 'visibility', 'hidden' );
        $( '#ar-radial-menu' ).css( 'visibility', 'visible' );


    } );
  } );
} );

function setArWorld() {
      buildSideMenu( 'augme' );

      userContext.participantState = 'focus';
      userContext.modMeState = true;
      userContext.uiState = 'ar';
      userContext.mode = 'ar';
      emitSessionUserContext( userContext );

      setPeerUserContext( 'all', 'mode', 'ar' );
      setPeerUserContext( 'all', 'participantState', 'peer' );
      userContext.participantState = 'focus';

// set a parameter to load specific World

      loadAr();

      document.getElementById( 'canvaspane' ).style.zIndex = '10';
      document.getElementById( 'arcanvaspane' ).style.zIndex = '200';

      document.getElementById( 'sticky-ar' ).style.display = 'visible';
      setDomPointerEvent( 'canvas0', 'none' );
      setDomPointerEvent( 'arcanvaspane', 'auto' );

      // inform all the peers of the mode
}

$( function() {
  $( '#vrMainButton' ).click( function() {

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
               return false;
           }
          userContext.arvrWorld = inputValue.toLowerCase();
          emitSessionUserContext( userContext );
          swal.close();
          setVrWorld();
          $( '#vrMainButton' ).css( 'visibility', 'hidden' );
          $( '#ar-radial-menu' ).css( 'visibility', 'visible' );
    } );
  } );
} );

function setVrWorld() {

      buildSideMenu( 'vrme' );

      userContext.participantState = 'focus';
      userContext.modMeState = true;
      userContext.uiState = 'vr';
      userContext.mode = 'vr';

      setPeerUserContext( 'all', 'mode', 'vr' );
      setPeerUserContext( 'all', 'participantState', 'peer' );
      userContext.participantState = 'focus';
      emitSessionUserContext( userContext );

// set a parameter to load specific World

      loadAr();

      document.getElementById( 'canvaspane' ).style.zIndex = '10';
      document.getElementById( 'arcanvaspane' ).style.zIndex = '50';

      document.getElementById( 'sticky-ar' ).style.display = 'visible';
      setDomPointerEvent( 'canvas0', 'none' );
      setDomPointerEvent( 'arcanvaspane', 'auto' );

      // inform all the pees of the mode

      msgString = 'User ' + userContext.rtcId + ' has entered VR Mode';
      emitMessage( msgString );

    }

  $( function() {
    $( '#shareaug' ).click( function() {

// Focus the AR initiator (modme)

    if ( userContext.mode === 'ar' ) {

      // Tell everyone to initialize

      var sessionId = socketServer.sessionid;
          socketServer.emit( 'utility', 'arClientInit', sessionId );

      // Start the orientation data feed

        emitArOrientationData();

        document.getElementById( 'sticky-ar' ).style.display = 'visible';

        msgString = 'User ' + userContext.rtcId + ' has Shared the AR World';
        emitMessage( msgString );
      }

    if ( userContext.mode === 'vr' ) {

      // Tell everyone to initialize AR

      var sessionId = socketServer.sessionid;
          socketServer.emit( 'utility', 'vrClientInit', sessionId );

      document.getElementById( 'sticky-ar' ).style.display = 'visible';

      msgString = 'User ' + userContext.rtcId + ' has Shared the VR World';
       emitMessage( msgString );
      }
    }
  );
} );


//
// Moderator Toggle
//

$( function() {
    $( '.moderator-swap' ).click( function() {
      if ( $( this ).attr( 'class' ) === 'moderator-swap' ) {
        this.src = this.src.replace( 'img/focus-moderator-off.png', 'img/focus-moderator.png' );
        modSwitch = true;
        setDomPointerEvent( 'canvas0', 'none' );
      } else {
        this.src = this.src.replace( 'img/focus-moderator.png', 'img/focus-moderator-off.png' );
        modSwitch = false;
        setDomPointerEvent( 'canvas0', 'auto' );
      }
      $( this ).toggleClass( 'on' );
    } );
  } );

//
//  Utility menu buttons
//   - Push only per workflow change (swh - 8-15-15)
//

  $( function() {
    $( '.doc-pub-1' ).click( function() {
      emitUtility( 'doc-1' );
      drawDoc1();
     } );
  } );

$( function() {
    $( '.doc-pub-2' ).click( function() {
      emitUtility( 'doc-2' );
      drawDoc1();
    } );
  } );

$( function() {
    $( '.arch-swap' ).click( function() {
      emitUtility( 'arch' );
      drawArch();
    } );
  } );

  $( function() {
    $( '.bullseye-swap' ).click( function() {
      emitUtility( 'bullseye' );
      drawBullsEye();
    } );
  } );

$( function() {
    $( '#mod-reset' ).click( function() {
        emitUtility( 'reset' );
        clearUtilCanvas();
        clearDrawCanvas();
      }
    );
  } );

$( function() {
    $( '#clearaug' ).click( function() {
        removeUserCreatedArObjects();
        clearUtilCanvas();
        clearDrawCanvas();
        emitUtility( 'reset' );
      }
    );
  } );

// --------------------------

 $( function() {
   $( '#b1' )
     .button( {
       label: 'Test Button'
     } )
     .click( function( event ) {
       alert( 'clicked button' );
     } );
 } );

  // toggle line drawing fade

  $( function() {
    $( '.fade-swap' ).click( function() {
      console.log( 'Erase Fade' );
      if ( $( this ).attr( 'class' ) === 'fade-swap' ) {
        this.src = this.src.replace( 'img/erase-on', 'img/erase-off' );
        fadeSwitch = false;
        toggleFade();
      } else {
        this.src = this.src.replace( 'img/erase-off', 'img/erase-on' );
        fadeSwitch = true;
        toggleFade();
      }
      $( this ).toggleClass( 'on' );
    } );

  } );

//
//  Video muting
//  - "hide" the video element and replace with image
//  - Toggled by main menu button
//  - based on the unique rtcid if the "owner"
//   - send mute message to other clients
//

function emitVideoMute( videoMuteData ) {
  var sessionId = socketServer.sessionid;
  socketServer.emit( 'videoMute', videoMuteData, sessionId );
}

$( function() {
  $( '.video-swap' ).click( function() {

    var rtcidToMute = easyrtc.myEasyrtcid;
    videoMuteData.rtcid = rtcidToMute;

    var boxToMute = _( connectList )
    .filter ( function( connectList ) { return connectList.rtcid === rtcidToMute; } )
    .pluck( 'boxno' )
    .value();

    var theAvatar = _( connectList )
    .filter ( function( connectList ) { return connectList.rtcid === rtcidToMute; } )
    .pluck ( 'avatar' )
    .value();

    var videoBoxToMute = document.getElementById( getIdOfBox( boxToMute ) );

    if ( $( this ).attr( 'class' ) === 'video-swap' ) {
      this.src = this.src.replace( 'img/video-on', 'img/video-off' );
        document.getElementById( getIdOfBox( boxToMute ) ).style.visibility = 'hidden';

        var avatar = document.getElementById( theAvatar );

        avatar.src  = 'img/' + theAvatar + '.png';
        avatar.style.width = videoBoxToMute.style.width;
        avatar.style.height = videoBoxToMute.style.height;
        avatar.style.left = videoBoxToMute.style.left;
        avatar.style.top = videoBoxToMute.style.top;
        avatar.style.visibility = 'visible';
        videoMuteData.state = 'hidden';
        videoMuteData.avatar = theAvatar;

        emitVideoMute( videoMuteData );
      } else {

        this.src = this.src.replace( 'img/video-off', 'img/video-on' );
        document.getElementById( getIdOfBox( boxToMute ) ).style.visibility = 'visible';
        document.getElementById( theAvatar ).style.visibility = 'hidden';
        videoMuteData.state = 'visible';

        emitVideoMute( videoMuteData );
      }
      $( this ).toggleClass( 'on' );

    for ( var button in uiStructure.structure ) {
      $( uiStructure.structure[button].mainButton ).fadeOut( 1000 );
    }

    } );
  } );

socketServer.on( 'videoMute', function( videoMuteData ) {

 var boxToMute = _( connectList )
  .filter( function( connectList ) { return connectList.rtcid === videoMuteData.rtcid; } )
  .pluck( 'boxno' )
  .value();

  var avatarForBox = videoMuteData.avatar;

//  Toggle the video box

  document.getElementById( getIdOfBox( boxToMute ) ).style.visibility = videoMuteData.state;

//  ...and now the avatar

  if ( data.state === 'visible' ) {
    document.getElementById( avatarForBox ).style.visibility = 'hidden';
  } else {
        var videoBoxToMute = document.getElementById( getIdOfBox( boxToMute ) );
        var avatar = document.getElementById( avatarForBox );
        avatar.src  = 'img/' + avatarForBox + '.png';
        avatar.style.width = videoBoxToMute.style.width;
        avatar.style.height = videoBoxToMute.style.height;
        avatar.style.left = videoBoxToMute.style.left;
        avatar.style.top = videoBoxToMute.style.top;
        avatar.style.visibility = 'visible';
  }
} );

// email invite dialog

$( function() {
    $( '#invite-dialog' ).dialog( {
        autoOpen: false
    } );
    $( '#inviteViaEmail' ).click( function() {
        $( '#invite-dialog' ).dialog( 'open' );
        for ( var button in uiStructure.structure ) {
      $( uiStructure.structure[button].mainButton ).fadeOut( 1000 );
    }
      } ) ;

// Validating Form Fields.....
    $( '#submit' ).click( function( e ) {
      var email = $( '#email' ).val();
      var name = $( '#name' ).val();
      var msg = $( '#msg' ).val();
      var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    if ( email === '' || name === '' ) {
      alert( 'Please fill all fields...!!!!!!' );
      e.preventDefault();
    } else if ( !( email ).match( emailReg ) ) {
      alert( 'Invalid Email...!!!!!!' );
      e.preventDefault();
    } else {

//submit the form data

     var inviteData = { 'name': name, 'email': email, 'msg': msg };
     $.post( '/', inviteData, function( response, status ) {
            } );
     $( '#invite-dialog' ).dialog( 'close' );
    }
  } ) ;
} );

}
