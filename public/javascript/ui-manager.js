//
//  Declare the high level UI Structure
//    - Main function buttons (left menu)
//    - Function detail buttons (right menu)

//  mainButton: button in main menu
//  functions: container for the layer function button list (re-name??)
//  buttons: buitton list in the layer menu
//
var uiStructure = {
  structure: {
    util: {
      mainButton: "#utilButton",
      functions: "#utility-container",
      buttons: [ "#doc-button-1", "#doc-button-2", "#bullseye" ],
      desc: "utility layer",
      initState: "none",
      baseZ: "20"
    },
    draw: {
      mainButton: "#drawButton",
      functions: "#draw-ui-container",
      buttons: [ "#fadeButton", "#b1" ],
      desc: "drawing layer",
      initState: "none",
      baseZ: "20"
    },
    p1: {
      mainButton: "#invite-via-email",
      buttons: [],
      desc: "tmp",
      initState: "none",
      baseZ: "20"
    },
    p2: {
      mainButton: "#textEntryButton",
      functions: "",
      buttons: [],
      desc: "tmp",
      initState: "none",
      baseZ: "20"
    },
    p3: {
      mainButton: "#muteButton",
      functions: "",
      buttons: [],
      desc: "tmp",
      initState: "none",
      baseZ: "20"
    }
  }
};

// Experiment with sensor data

var geoData = document.querySelector( "#geo-data" );

navigator.geolocation.watchPosition( function( position ) {
  geoData.innerHTML = position.coords.latitude.toFixed( 5 ) + "<br />" +
                      position.coords.longitude.toFixed( 5 );
} );

function buildSideMenu( layer ) {

  // remove existing side menu(s)
  // expand right element div and buttons for layer specific menu
  // collapse main menu

  _.each( uiStructure.structure, function( fcn ) {
    $( fcn.functions ).fadeOut( 5 );
  } );

  $( "#layer-menu-button" ).trigger( "click" );

  $( uiStructure.structure[layer].functions ).fadeIn( 5 );

  _.each( uiStructure.structure[layer].buttons, function( button ) {
    $( button ).fadeIn( 2000 );
  } );
}

// the main menue collapse-expand

var collapsed = true;

$( document ).ready( function() {
  var t = 1000;
  $( "#layer-menu-button" ).click( function() {
    var button;
    if ( collapsed === true ) {
      collapsed = false;
      for ( button in uiStructure.structure ) {
        $( uiStructure.structure[button].mainButton ).fadeIn( t );
      }
    } else {
      collapsed = true;
      t = 1000;
      for ( button in uiStructure.structure ) {
        t = 1000;
        $( uiStructure.structure[button].mainButton ).fadeOut( t );
      }
    }
  } );
} );

//
//   Utility layer UI
//
function utilUI() {
buildSideMenu( "util" );
}

//
//   Drawing  Layer UI
//
function drawUI() {
buildSideMenu( "draw" );
}

  //toggle switch to render document

  $( function() {
    $( ".doc-pub-1" ).click( function() {
      if ( $( this ).attr( "class" ) === "doc-pub-1" ) {
        emitUtility( "doc-1" );
      } else {
        clearUtilCanvas();
      }
      $( this ).toggleClass( "on" );
    } );
  } );

$( function() {
    $( ".doc-pub-2" ).click( function() {
      if ( $( this ).attr( "class" ) === "doc-pub-2" ) {
        emitUtility( "doc-2" );
      } else {
        clearUtilCanvas();
      }
      $( this ).toggleClass( "on" );
    } );
  } );

  $( function() {
    $( ".bullseye-swap" ).click( function() {
      if ( $( this ).attr( "class" ) === "bullseye-swap" ) {
        emitUtility( "bullseye" );
      } else {
        clearUtilCanvas();
      }
      $( this ).toggleClass( "on" );
    } );
  } );

// --------------------------

 $( function() {
   $( "#b1" )
     .button( {
       label: "Test Button"
     } )
     .click( function( event ) {
       alert( "clicked button" );
     } );
 } );

  // toggle line drawing fade

  $( function() {
    $( ".fade-swap" ).click( function() {
      if ( $( this ).attr( "class" ) === "fade-swap" ) {
        this.src = this.src.replace( "img/erase-on", "img/erase-off" );
        fadeSwitch = false;
        toggleFade();
      } else {
        this.src = this.src.replace( "img/erase-off", "img/erase-on" );
        fadeSwitch = true;
        toggleFade();
      }
      $( this ).toggleClass( "on" );
    } );
  } );

// email invite dialog

$( function() {
    $( "#invite-dialog" ).dialog( {
        autoOpen: false
    } );
    $( "#invite-via-email" ).click( function() {
        $( "#invite-dialog" ).dialog( "open" );
        console.log( "Clicked email invite" );
      } ) ;

// Validating Form Fields.....
    $( "#submit" ).click( function( e ) {
      var email = $( "#email" ).val();
      var name = $( "#name" ).val();
      var msg = $( "#msg" ).val();
      var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    if ( email === "" || name === "" ) {
      alert( "Please fill all fields...!!!!!!" );
      e.preventDefault();
    } else if ( !( email ).match( emailReg ) ) {
      alert( "Invalid Email...!!!!!!" );
      e.preventDefault();
    } else {

//submit the form data

     var inviteData = { "name": name, "email": email, "msg": msg };
     $.post( "/", inviteData, function( response, status ) {
               console.log( "Mail in ui-manager.js:", inviteData );
            } );

     $( "#invite-dialog" ).dialog( "close" );
    }
  } ) ;
} );
