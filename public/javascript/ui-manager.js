//
//  Declare the high level UI Structure
//    - Must be valid JSON
//    - Main function buttons (left menu)
//    - Function detail buttons (right menu)

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

//var arData = {};
//
//// Experiment with sensor data
//
//var arData = document.querySelector( '#geo-data' );
//  navigator.geolocation.watchPosition( function( position ) {
//  geoData.lat = position.coords.latitude.toFixed( 5 );
//  geoData.lon = position.coords.longitude.toFixed( 5 );
//
//  emitArOrientation( arData );
//
//} );
//
//function emitArOrientation( data ) {
//  var sessionId = socketServer.sessionid;
//  socketServer.emit( 'arOrientation', data, sessionId );
//}
//
//socketServer.on( 'geo', function( data ) {
//  geoData.innerHTML = data.lat + '<br />' +
//                      data.lon;
//} );

function buildSideMenu( layer ) {

  // remove existing side menu(s)
  // expand right element div and buttons for function specific menu
  // collapse main menu

  _.each( uiStructure.structure, function( fcn ) {
    $( fcn.sideBar ).fadeOut( 5 );
  } );

  $( '#layer-menu-button' ).trigger( 'click' );

  $( uiStructure.structure[layer].sideBar ).fadeIn( 5 );

  _.each( uiStructure.structure[layer].buttons, function( button ) {
    $( button ).fadeIn( 2000 );
  } );
}

// the main menue collapse-expand

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
      t = 1000;
      for ( button in uiStructure.structure ) {
        t = 1000;
        $( uiStructure.structure[button].mainButton ).fadeOut( t );
      }
    }
  } );
} );

//  Utility to make a dom element(e.g., video canvas, etc) mouse sensitive
//  - auto, none
//  - all other events are SVG realted

function setDomMouseEvent( domId, mode ) {
  document.getElementById( domId ).style.pointerEvents = mode;
}

function utilUI() {
buildSideMenu( 'util' );
}

function drawUI() {
  buildSideMenu( 'draw' );
  setDomMouseEvent('arcanvaspane', 'none');
  setDomMouseEvent('canvas0', 'auto');
}

function modmeUI() {
buildSideMenu( 'modme' );
setDomMouseEvent('canvas0', 'none');
setDomMouseEvent('arcanvaspane', 'none');
}



function augmeUI() {

//if( !userContext.arCapable ) {
//    console.log( 'augmeUI - This device is not AR capable' );
//    messageBar( 'This device is not AR capable..no AR for U' );
 // }
 // else {
    buildSideMenu( 'augme' );
   // userContext.participantState = 'focus';
    loadArModel();
    setDomMouseEvent('canvas0', 'none');
  //}
}



function shareAr() {

    userContext.participantState = 'focus';
    userContext.modMeState = true;

    var sessionId = socketServer.sessionid;
        socketServer.emit( 'focus', userContext.rtcId, sessionId );

  // Tell everyone to initialize AR

  var sessionId = socketServer.sessionid;
        socketServer.emit( 'utility', 'arClientInit', sessionId );

    var msgString = 'User ' + userContext.rtcId + ' has become the focus in AR mode'
    messageBar( msgString );
}

//
// Moderator Toggle
//

$( function() {
    $( '.moderator-swap' ).click( function() {
      if ( $( this ).attr( 'class' ) === 'moderator-swap' ) {
        this.src = this.src.replace( 'img/focus-moderator-off.png', 'img/focus-moderator.png' );
        modSwitch = true;
        setDomMouseEvent('canvas0', 'none');
      } else {
        this.src = this.src.replace( 'img/focus-moderator.png', 'img/focus-moderator-off.png' );
        modSwitch = false;
        setDomMouseEvent('canvas0', 'auto');
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
         console.log('at button fadeSwitch:', fadeSwitch);
      } else {
        this.src = this.src.replace( 'img/erase-off', 'img/erase-on' );
        fadeSwitch = true;
        toggleFade();
         console.log('at button fadeSwitch:', fadeSwitch);
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

$( function() {
  $( '.video-swap' ).click( function() {

    var rtcidToMute = easyrtc.myEasyrtcid;
    videoMuteData.rtcid = rtcidToMute;

    var boxToMute = _( connectList )
    .filter( function( connectList ) { return connectList.rtcid === rtcidToMute; } )
    .pluck( 'boxno' )
    .value();

    var theAvatar = _( connectList ).filter( function( connectList )
    { return connectList.rtcid === rtcidToMute; } )
    .pluck( 'avatar' )
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

function emitVideoMute( videoMuteData ) {
  var sessionId = socketServer.sessionid;
  //console.log('sending videoMuteData:', videoMuteData);
  socketServer.emit( 'videoMute', videoMuteData, sessionId );
}

socketServer.on( 'videoMute', function( videoMuteData ) {

 var boxToMute = _(connectList)
  .filter(function(connectList) { return connectList.rtcid === videoMuteData.rtcid; })
  .pluck('boxno')
  .value();

  var avatarForBox = videoMuteData.avatar;
  //= _(connectList)
  //.filter(function(connectList) { return connectList.rtcid == videoMuteData.rtcid; })
  //.pluck('avatar')
  //.value();

   //var theAvatar = _(connectList)
   //.filter(function(connectList) { return connectList.rtcid == videoMuteData.rtcid; })
   //.pluck('avatar')
   //.value();

//  Toggle the video box

//console.log('socketserver recieve videoMuteData:', videoMuteData, 'boxToMute:', boxToMute, 'avatar:', avatarForBox);

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
               //console.log( 'Mail in ui-manager.js:', inviteData );
            } );
     $( '#invite-dialog' ).dialog( 'close' );
    }
  } ) ;
} );
