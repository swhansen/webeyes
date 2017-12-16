//
//  Declare the high level UI Structure
//    - Must be valid JSON
//    - Main function buttons (left menu)
//    - Function detail buttons (right menu)visability

//  mainButton: button in main menu
//  sideBar: container for the layer function button list (re-name??)
//  buttons: button list in the layer menu

var mainCollapsed = true;
var modSwitch = false;
var msgString;

var fullScreenToggle = false;

// initialize the core menu

$.getJSON( '../menudescriptors/coreStructure.json', function( data ) {
    uiStructure = data;
} );

var videoMuteData = {};
var thisBox;


$( function() {
    $( '#fullscreen' ).click( function() {

        fullScreenToggle = !fullScreenToggle;

        if ( fullScreenToggle ) {
            launchIntoFullscreen( document.documentElement );
        } else {
            exitFullscreen();
        }
        for ( var button in uiStructure.structure ) {
            $( uiStructure.structure[ button ].mainButton ).fadeOut( 1000 );
        }
    } );
} );

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

// the main menu collapse-expand

$( document ).ready( function() {
    var t = 500;
    $( '#layer-menu-button' ).click( function() {
        var button;
        if ( mainCollapsed === true ) {
            mainCollapsed = false;
            for ( button in uiStructure.structure ) {
                $( uiStructure.structure[ button ].mainButton ).fadeIn( t );
            }
        } else {
            mainCollapsed = true;
            for ( button in uiStructure.structure ) {
                t = 500;
                $( uiStructure.structure[ button ].mainButton ).fadeOut( t );
            }
        }
    } );
} );

function setArWorld() {

    //     buildSideMenu( 'augme' );

    userContext.modMeState = true;
    userContext.uiState = 'ar';
    userContext.mode = 'ar';
    emitSessionUserContext( userContext );

    setPeerUserContext( 'all', 'mode', 'ar' );
    setPeerUserContext( 'all', 'participantState', 'peer' );
    userContext.participantState = 'focus';

    loadAr();

    document.getElementById( 'canvaspane' ).style.zIndex = '10';
    document.getElementById( 'arcanvaspane' ).style.zIndex = '200';

    //    document.getElementById( 'sticky-ar' ).style.display = 'visible';
    setDomPointerEvent( 'canvas0', 'none' );
    setDomPointerEvent( 'arcanvaspane', 'auto' );

    // inform all the peers of the mode
}

function setTestWorld() {

    //     buildSideMenu( 'augme' );

    userContext.participantState = 'focus';
    userContext.modMeState = true;
    userContext.uiState = 'ar';
    userContext.mode = 'ar';
    emitSessionUserContext( userContext );

    setPeerUserContext( 'all', 'mode', 'ar' );
    setPeerUserContext( 'all', 'participantState', 'peer' );
    userContext.participantState = 'focus';

    loadAr();

    document.getElementById( 'canvaspane' ).style.zIndex = '10';
    document.getElementById( 'arcanvaspane' ).style.zIndex = '200';

    //    document.getElementById( 'sticky-ar' ).style.display = 'visible';
    setDomPointerEvent( 'canvas0', 'none' );
    setDomPointerEvent( 'arcanvaspane', 'auto' );

}

function setVrWorld() {

    //     buildSideMenu( 'vrme' );

    //   userContext.participantState = 'focus';
    userContext.modMeState = true;
    userContext.uiState = 'vr';
    userContext.mode = 'vr';

    setPeerUserContext( 'all', 'mode', 'vr' );
    setPeerUserContext( 'all', 'uiState', 'vr' );
    setPeerUserContext( 'all', 'participantState', 'peer' );

    userContext.participantState = 'focus';

    console.log( 'setVRWorld:', userContext );

    emitSessionUserContext( userContext );

    loadAr();

    document.getElementById( 'canvaspane' ).style.zIndex = '10';
    document.getElementById( 'arcanvaspane' ).style.zIndex = '50';

    //    document.getElementById( 'sticky-ar' ).style.display = 'visible';
    setDomPointerEvent( 'canvas0', 'none' );
    setDomPointerEvent( 'arcanvaspane', 'auto' );

    // inform all the peers of the mode

    msgString = 'User ' + userContext.rtcId + ' has entered VR Mode';
    emitMessage( msgString );

}

function shareArVrWorld() {
    if ( userContext.mode === 'ar' ) {

        // Tell everyone to initialize

        var sessionId = socketServer.sessionid;
        let data = {};
        data.sessionId = userContext.sessionId;
        data.data = 'arClientInit';

        socketServer.emit( 'utility', data, sessionId );

        msgString = 'User ' + userContext.rtcId + ' has Shared the AR World';
        emitMessage( msgString );
    }

    if ( userContext.mode === 'vr' ) {

        // Tell everyone to initialize AR

        var sessionId = socketServer.sessionid;

        let data = {};
        data.sessionId = userContext.sessionId;
        data.data = 'vrClientInit';

        socketServer.emit( 'utility', data, sessionId );

        //    document.getElementById( 'sticky-ar' ).style.display = 'visible';

        msgString = 'User ' + userContext.rtcId + ' has Shared the VR World';
        emitMessage( msgString );
    }
}

function emitVideoMute( videoMuteData ) {
    var sessionId = socketServer.sessionid;
    socketServer.emit( 'videoMute', videoMuteData, sessionId );
}

// toggle the compass

$( function() {
    $( '#sticky-compass' ).click( function() {
        toggleCompass();
    } );
} );

//    compassToggle = !compassToggle;
//   // let data = compassToggle;
//    orientationCompass( compassToggle );
//    var sessionId = socketServer.sessionid;
//    socketServer.emit( 'toggleCompass', compassToggle, sessionId );
//  } );
//  } );


function toggleCompass() {
    compassToggle = !compassToggle;
    orientationCompass( compassToggle );
    var sessionId = socketServer.sessionid;
    socketServer.emit( 'toggleCompass', compassToggle, sessionId );
}


$( function() {
    $( '.video-swap' ).click( function() {

        var rtcidToMute = easyrtc.myEasyrtcid;
        videoMuteData.rtcid = rtcidToMute;

        var boxToMute = _( connectList )
            .filter( function( connectList ) { return connectList.rtcid === rtcidToMute; } )
            .map( 'boxno' )
            .value();

        var theAvatar = _( connectList )
            .filter( function( connectList ) { return connectList.rtcid === rtcidToMute; } )
            .map( 'avatar' )
            .value();

        var videoBoxToMute = document.getElementById( getIdOfBox( boxToMute ) );

        if ( $( this ).attr( 'class' ) === 'video-swap' ) {

            $( this ).find( 'use' ).attr( 'xlink:href', 'img/weg2rt-defs.svg#weg2rt-b-mute-video' );

            document.getElementById( getIdOfBox( boxToMute ) ).style.visibility = 'hidden';

            var avatar = document.getElementById( theAvatar );
            avatar.src = 'img/' + theAvatar + '.png';
            avatar.style.width = videoBoxToMute.style.width;
            avatar.style.height = videoBoxToMute.style.height;
            avatar.style.left = videoBoxToMute.style.left;
            avatar.style.top = videoBoxToMute.style.top;
            avatar.style.visibility = 'visible';
            videoMuteData.state = 'hidden';
            videoMuteData.avatar = theAvatar;
            emitVideoMute( videoMuteData );

        } else {

            $( this ).find( 'use' ).attr( 'xlink:href', 'img/weg2rt-defs.svg#weg2rt-b-video' );

            document.getElementById( getIdOfBox( boxToMute ) ).style.visibility = 'visible';
            document.getElementById( theAvatar ).style.visibility = 'hidden';
            videoMuteData.state = 'visible';

            emitVideoMute( videoMuteData );
        }

        $( this ).toggleClass( 'on' );

        for ( var button in uiStructure.structure ) {
            $( uiStructure.structure[ button ].mainButton ).fadeOut( 1000 );
        }
    } );
} );

socketServer.on( 'videoMute', function( videoMuteData ) {

    var boxToMute = _( connectList )
        .filter( function( connectList ) { return connectList.rtcid === videoMuteData.rtcid; } )
        .map( 'boxno' )
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
        avatar.src = 'img/' + avatarForBox + '.png';
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
            $( uiStructure.structure[ button ].mainButton ).fadeOut( 1000 );
        }
    } );

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
            $.post( '/', inviteData, function( response, status ) {} );
            $( '#invite-dialog' ).dialog( 'close' );
        }
    } );
} );

//}