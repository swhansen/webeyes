//
//  Declare the high level UI Structure
//    - Must be valid JSON
//    - Main function buttons (left menu)
//    - Function detail buttons (right menu)

//  mainButton: button in main menu
//  sideBar: container for the layer function button list (re-name??)
//  buttons: button list in the layer menu
//
//  note: originally concieved of as only for layer mgmt
//    - e.g., one R menu for evert layer type.....should rethink.
//

var uiStructure = {};
var mainCollapsed = true;

$.getJSON( '../menudescriptors/coreStructure.json', function( data ){
  uiStructure = data;
  console.log(data);
} );



var modMeStructure = {
    "structure": {
        "util": {
            "mainButton": "#utilButton",
            "sideBar": "#utility-container",
            "buttons": [
                "#doc-button-1",
                "#doc-button-2",
                "#bullseye"
            ],
            "desc": "utility layer",
            "initState": "none",
            "baseZ": "20"
        },
        "draw": {
            "mainButton": "#drawButton",
            "sideBar": "#draw-ui-container",
            "buttons": [
                "#fadeButton",
                "#b1"
            ],
            "desc": "drawing layer",
            "initState": "none",
            "baseZ": "20"
        },
        "video": {
            "mainButton": "#videoButton",
            "buttons": [],
            "desc": "toggle video broadcast",
            "initState": "none",
            "baseZ": "20"
        },
        "emailInvite": {
            "mainButton": "#inviteViaEmail",
            "buttons": [],
            "desc": "tmp",
            "initState": "none",
            "baseZ": "20"
        },
        "text": {
            "mainButton": "#textEntryButton",
            "sideBar": "",
            "buttons": [],
            "desc": "IM Text",
            "initState": "none",
            "baseZ": "20"
        },
        "p3": {
            "mainButton": "#muteButton",
            "sideBar": "",
            "buttons": [],
            "desc": "Mute Audio",
            "initState": "none",
            "baseZ": "20"
        },
        "codeInput": {
            "mainButton": "#codeDialogButton",
            "buttons": [],
            "desc": "special code input",
            "initState": "none",
            "baseZ": "20"
        },
        "modme": {
            "mainButton": "#modmeButton",
            "buttons": [],
            "desc": "moderator",
            "initState": "none",
            "baseZ": "20"
        }
    }
  }

  var devMeStructure = {
    "structure": {
        "util": {
            "mainButton": "#utilButton",
            "sideBar": "#utility-container",
            "buttons": [
                "#doc-button-1",
                "#doc-button-2",
                "#bullseye"
            ],
            "desc": "utility layer",
            "initState": "none",
            "baseZ": "20"
        },
        "draw": {
            "mainButton": "#drawButton",
            "sideBar": "#draw-ui-container",
            "buttons": [
                "#fadeButton",
                "#b1"
            ],
            "desc": "drawing layer",
            "initState": "none",
            "baseZ": "20"
        },
        "video": {
            "mainButton": "#videoButton",
            "buttons": [],
            "desc": "toggle video broadcast",
            "initState": "none",
            "baseZ": "20"
        },
        "emailInvite": {
            "mainButton": "#inviteViaEmail",
            "buttons": [],
            "desc": "tmp",
            "initState": "none",
            "baseZ": "20"
        },
        "text": {
            "mainButton": "#textEntryButton",
            "sideBar": "",
            "buttons": [],
            "desc": "IM Text",
            "initState": "none",
            "baseZ": "20"
        },
        "p3": {
            "mainButton": "#muteButton",
            "sideBar": "",
            "buttons": [],
            "desc": "Mute Audio",
            "initState": "none",
            "baseZ": "20"
        },
        "codeInput": {
            "mainButton": "#codeDialogButton",
            "buttons": [],
            "desc": "special code input",
            "initState": "none",
            "baseZ": "20"
        },
        "devme": {
            "mainButton": "#devmeButton",
            "buttons": [],
            "desc": "developer",
            "initState": "none",
            "baseZ": "20"
        }
    }
  }

var videoData = {};
var thisBox;

//uiStructure = coreStructure;

// Experiment with sensor data

var geoData = document.querySelector( '#geo-data' );

navigator.geolocation.watchPosition( function( position ) {
  geoData.innerHTML = position.coords.latitude.toFixed( 5 ) + '<br />' +
                      position.coords.longitude.toFixed( 5 );
} );

function buildSideMenu( layer ) {

  // remove existing side menu(s)
  // expand right element div and buttons for layer specific menu
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


function utilUI() {
buildSideMenu( 'util' );
}

function drawUI() {
buildSideMenu( 'draw' );
}

  $( function() {
    $( '.doc-pub-1' ).click( function() {
      if ( $( this ).attr( 'class' ) === 'doc-pub-1' ) {
        emitUtility( 'doc-1' );
      } else {
        clearUtilCanvas();
      }
      $( this ).toggleClass( 'on' );
    } );
  } );

$( function() {
    $( '.doc-pub-2' ).click( function() {
      if ( $( this ).attr( 'class' ) === 'doc-pub-2' ) {
        emitUtility( 'doc-2' );
      } else {
        clearUtilCanvas();
      }
      $( this ).toggleClass( 'on' );
    } );
  } );

  $( function() {
    $( '.bullseye-swap' ).click( function() {
      if ( $( this ).attr( 'class' ) === 'bullseye-swap' ) {
        emitUtility( 'bullseye' );
      } else {
        clearUtilCanvas();
      }
      $( this ).toggleClass( 'on' );
    } );
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
        toggleFade();util
      }
      $( this ).toggleClass( 'on' );
    } );
  } );

// Video muting

$( function() {
  $( '.video-swap' ).click( function() {
    thisBox = 1;
    if ( $( this ).attr( 'class' ) === 'video-swap' ) {
      this.src = this.src.replace( 'img/video-on', 'img/video-off' );
        document.getElementById( getIdOfBox( thisBox ) ).style.visibility = "hidden";
        document.getElementById( 'avatar1' ).style.visibility = "visible";

       // console.log('thisBox in ui-manager:', thisBox);
        videoData.state = "hidden";
        videoData.box = thisBox;
        emitVideo( videoData );
      } else {
        this.src = this.src.replace( 'img/video-off', 'img/video-on' );
        document.getElementById( getIdOfBox( thisBox ) ).style.visibility = "visible";
        document.getElementById( 'avatar1' ).style.visibility = "hidden";
         videoData.state = "visible";
         videoData.box = 1;
         emitVideo( videoData );
      }
      $( this ).toggleClass( 'on' );
    } );
  } );

function emitVideo( videoData ) {
  var sessionId = socketServer.sessionid;
  socketServer.emit( 'video', videoData, sessionId );
}

socketServer.on( 'video', function( data ) {
  document.getElementById( getIdOfBox( data.box ) ).style.visibility = data.state;
  if ( data.state === 'visible' ) {
    document.getElementById( 'avatar1' ).style.visibility = "hidden";
  } else {
    document.getElementById( 'avatar1' ).style.visibility = "visible";
  }
} );

// code input dialog

$( function() {
    $( '#codeDialogModal' ).dialog( {
        autoOpen: false
    } );
    $( '#codeDialogButton' ).click( function() {
        $( '#codeDialogModal' ).dialog( 'open' );
        console.log( 'Clicked code dialog' );
      } );

$( '#submit-code' ).click( function( e ) {
      var bCode  = $( '#button-code' ).val();
    if ( bCode === '' ) {
      alert( 'Please enter a code' );
      e.preventDefault();
    } else if ( !( _.includes( [ 'devme', 'modme' ], bCode ) ) ) {
      alert( 'Please enter a valid code' );
      e.preventDefault();
    } else {

switch ( bCode ) {
  case 'modme':
        uiStructure = modMeStructure;
        $( '#codeDialogModal' ).dialog( 'close' );
        for ( button in uiStructure.structure ) {
        t = 1000;
        $( uiStructure.structure[button].mainButton ).fadeOut( t );
        }
        document.getElementById( 'devmeButton' ).style.visibility = "hidden";
        document.getElementById( 'modmeButton' ).style.visibility = "visible";
        var mainCollapsed = true;
        break;
 case 'devme':
       uiStructure = devMeStructure;
       $( '#codeDialogModal' ).dialog( 'close' );
       for ( button in uiStructure.structure ) {
       t = 1000;
       $( uiStructure.structure[button].mainButton ).fadeOut( t );
       }
       document.getElementById( 'modmeButton' ).style.visibility = "hidden";
       document.getElementById( 'devmeButton' ).style.visibility = "visible";
       var mainCollapsed = true;
    }
    };
  } );
} );

// email invite dialog

$( function() {
    $( '#invite-dialog' ).dialog( {
        autoOpen: false
    } );
    $( '#inviteViaEmail' ).click( function() {
        $( '#invite-dialog' ).dialog( 'open' );
        console.log( 'Clicked email invite' );
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
               console.log( 'Mail in ui-manager.js:', inviteData );
            } );

     $( '#invite-dialog' ).dialog( 'close' );
    }
  } ) ;
} );
