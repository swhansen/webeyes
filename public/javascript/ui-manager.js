//
//  Declare the high level UI Structure
//    - Must be valid JSON
//    - Main function buttons (left menu)
//    - Function detail buttons (right menu)visability

//  mainButton: button in main menu
//  sideBar: container for the layer function button list (re-name??)
//  buttons: button list in the layer menu
//

var uiStructure = {};
var mainCollapsed = true;
var modSwitch = false;

// initialize the core menu

$.getJSON( '../menudescriptors/coreStructure.json', function( data ) {
  uiStructure = data;
} );

var videoMuteData = {};
var thisBox;

function setDomPointerEvent( domId, mode ) {
  document.getElementById( domId ).style.pointerEvents = mode;
}

function getDomPointerStatus( list ) {
  var obj = {};
 _.forEach( list, function( key ) {
    obj[ key ] = document.getElementById( key ).style.pointerEvents;
  } );
    return obj;
}

console.log( 'domPointerStatus:', getDomPointerStatus( layerList ) );

function getDomZindex( list ) {
var obj = {};
_.forEach( list, function( key ) {

  var elem = document.getElementById( key );

  //var theCSSprop = document.getElementById( key ).style.zIndex;

  var theCSSprop = elem.css( 'z-index' );

  //var theCSSprop = window.getComputedStyle( elem, null ).getPropertyValue( 'zIndex' );

  obj[ key ] = theCSSprop;
  } );
  return obj;
}

console.log( 'domZindex:', getDomZindex( layerList ) );

//
// Sticky menus
//

$( function() {
$( '#sticky-draw' ).click( function() {

    _.each( uiStructure.structure, function( fcn ) {
    $( fcn.sideBar ).fadeOut( 2 );
  } );

  setDomPointerEvent( 'canvas0', 'auto' );
  setDomPointerEvent( 'arcanvaspane', 'none' );

  messageBar( 'Draw Layer is in Focus' );
 } );
  } );

$( function() {
  $( '#sticky-ar' ).click( function() {

    _.each( uiStructure.structure, function( fcn ) {
       $( fcn.sideBar ).fadeOut( 2 );
      } );

     setDomPointerEvent( 'canvas0', 'none' );
     setDomPointerEvent( 'arcanvaspane', 'auto' );
     messageBar( 'AR Layer is in Focus' );
  } );
} );

$( function() {
  $( '#sticky-compass' ).click( function() {
    compassToggle = !compassToggle;
    var data = compassToggle;
    orientationAr( data );
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
  var t = 1000;
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
        t = 3000;
        $( uiStructure.structure[button].mainButton ).fadeOut( t );
      }
    }
  } );
} );

$( function() {
  $( '#leapButton' ).click( function() {

    userContext.isLeap = true;

// Focus the Leap initiator

  //  var sessionId = socketServer.sessionid;
  //      socketServer.emit( 'focus', userContext.rtcId, sessionId );

// Load Leap locally

    leapFocus();

  // Tell everyone to initialize Leap

  var sessionId = socketServer.sessionid;
      socketServer.emit( 'utility', 'leapClientInit', sessionId );

    var msgString = 'User ' + userContext.rtcId + ' has become iniialized Leap';
    messageBar( msgString );
    }
  );
} );

$( function() {
  $( '#utilButton' ).click( function() {
    buildSideMenu( 'util' );
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
      buildSideMenu( 'augme' );
      userContext.participantState = 'focus';
      userContext.modMeState = true;
      userContext.uiState = 'ar';

      loadAr( userContext.participantState );

      document.getElementById( 'sticky-ar' ).style.display = 'visible';
      setDomPointerEvent( 'canvas0', 'none' );
      setDomPointerEvent( 'arcanvaspane', 'auto' );
    }
  );
} );

function shareAr() {

    userContext.participantState = 'peer';
    userContext.modMeState = true;

// Focus the AR initiator (modme)

    var sessionId = socketServer.sessionid;
        socketServer.emit( 'focus', userContext.rtcId, sessionId );

  // Tell everyone to initialize AR

  //var sessionId = socketServer.sessionid;
        socketServer.emit( 'utility', 'arClientInit', sessionId );

    var msgString = 'User ' + userContext.rtcId + ' has become the focus in AR mode';
    messageBar( msgString );

    // Start the orientation data feed

    emitArOrientationData();

    document.getElementById( 'sticky-ar' ).style.display = 'visible';
}

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

 //    if ( $( this ).attr( 'class' ) === 'doc-pub-1' ) {
 //      emitUtility( 'doc-1' );
 //    } else {
 //      clearUtilCanvas();
 //    }
 //    $( this ).toggleClass( 'on' );
 //  } );
 //} );

$( function() {
    $( '.doc-pub-2' ).click( function() {
      emitUtility( 'doc-2' );
      drawDoc1();
    } );
  } );

//    if ( $( this ).attr( 'class' ) === 'doc-pub-2' ) {
//      emitUtility( 'doc-2' );
//    } else {
//      clearUtilCanvas();
//    }
//    $( this ).toggleClass( 'on' );
//  } );
//} );

$( function() {
    $( '.arch-swap' ).click( function() {
      emitUtility( 'arch' );
      drawArch();
    } );
  } );

//      if ( $( this ).attr( 'class' ) === 'arch-swap' ) {
//        emitUtility( 'arch' );
//      } else {
//        clearUtilCanvas();
//      }
//      $( this ).toggleClass( 'on' );
//    } );
//  } );

  $( function() {
    $( '.bullseye-swap' ).click( function() {
      emitUtility( 'bullseye' );
      drawBullsEye();
    } );
  } );

 //     if ( $( this ).attr( 'class' ) === 'bullseye-swap' ) {
 //       emitUtility( 'bullseye' );
 //     } else {
 //       clearUtilCanvas();
 //     }
 //     $( this ).toggleClass( 'on' );
 //   } );
 // } );

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
