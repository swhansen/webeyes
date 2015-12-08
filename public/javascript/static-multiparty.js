var activeBox = -1; // nothing selected
var aspectRatio = 4 / 3;

 // standard definition video aspect ratio
var maxCALLERS = 3;
var numVideoOBJS = maxCALLERS + 1;
var layout;
var connectList = [];
var modmeState = false;
var compassToggle = false;

/*jshint -W020 */
socketServer = io.connect( '/' );
/*jshint +W020 */

// Container for User Context

var userContext = {
  rtcId: '',
  modMeState: 'false',
  participantState: 'peer',
  uiState: '',
  mode: '',
  arCapable: false,
  orientation: false,
  motion: false,
  geoLocation: false,
  mobile: false,
  browserType: ''
};

easyrtc.dontAddCloseButtons( false );

// Footer Messages

function messageBar( msg ) {
  $( '#messageFooter' ).html( msg ).fadeIn( 500 );
  $( '#messageFooter' ).html( msg ).fadeOut( 4000 );
}

// socket.io communication

function emitMessage( data ) {
  var sessionId = socketServer.sessionid;
  socketServer.emit( 'message', data, sessionId );
}

socketServer.on( 'message', function( data ) {
      messageBar( data );
      } );

function getIdOfBox( boxNum ) {
    return 'box' + boxNum;
}

function getIdOfCanvas( canvasNum ) {
    return 'canvas' + canvasNum;
}

function reshapeFull( parentw, parenth ) {
    return {
        left: 0,
        top: 0,
        width: parentw,
        height: parenth
    };
}

function reshapeTextEntryBox( parentw, parenth ) {
    return {
        left: parentw / 4,
        top: parenth / 4,
        width: parentw / 2,
        height: parenth / 4
    };
}

function reshapeTextEntryField( parentw, parenth ) {
    return {
        width: parentw - 40
    };
}

var margin = 20;

function reshapeToFullSize( parentw, parenth ) {
    var left, top, width, height;
    var margin = 20;

    if ( parentw < parenth * aspectRatio ) {
        width = parentw - margin;
        height = width / aspectRatio;
    } else {
        height = parenth - margin;
        width = height * aspectRatio;
    }
    left = ( parentw - width ) / 2;
    top = ( parenth - height ) / 2;
    return {
        left: left,
        top: top,
        width: width,
        height: height
    };
}

// a negative percentLeft is interpreted as setting the right edge of the object
// that distance from the right edge of the parent.
// Similar for percentTop.

function setThumbSizeAspect( percentSize, percentLeft, percentTop, parentw, parenth, aspect ) {

    var width, height;
    if ( parentw < parenth * aspectRatio ) {
        width = parentw * percentSize;
        height = width / aspect;
    } else {
        height = parenth * percentSize;
        width = height * aspect;
    }
    var left;
    if ( percentLeft < 0 ) {
        left = parentw - width;
    } else {
        left = 0;
    }
    left += Math.floor( percentLeft * parentw );
    var top = 0;
    if ( percentTop < 0 ) {
        top = parenth - height;
    } else {
        top = 0;
    }
    top += Math.floor( percentTop * parenth );
    return {
        left: left,
        top: top,
        width: width,
        height: height
    };
}

function setThumbSize( percentSize, percentLeft, percentTop, parentw, parenth ) {
    return setThumbSizeAspect( percentSize, percentLeft, percentTop, parentw, parenth, aspectRatio );
}

function setThumbSizeButton( percentSize, percentLeft, percentTop, parentw, parenth, imagew, imageh ) {
    return setThumbSizeAspect( percentSize, percentLeft, percentTop, parentw, parenth, imagew / imageh );
}

var sharedVideoWidth = 1;
var sharedVideoHeight = 1;

function reshape1of2( parentw, parenth ) {
    if ( layout == 'p' ) {
        return {
            left: ( parentw - sharedVideoWidth ) / 2,
            top: ( parenth - sharedVideoHeight * 2 ) / 3,
            width: sharedVideoWidth,
            height: sharedVideoHeight
        };
    } else {
        return {
            left: ( parentw - sharedVideoWidth * 2 ) / 3,
            top: ( parenth - sharedVideoHeight ) / 2,
            width: sharedVideoWidth,
            height: sharedVideoHeight
        };
    }
}

function reshape2of2( parentw, parenth ) {
    if ( layout == 'p' ) {
        return {
            left: ( parentw - sharedVideoWidth ) / 2,
            top: ( parenth - sharedVideoHeight * 2 ) / 3 * 2 + sharedVideoHeight,
            width: sharedVideoWidth,
            height: sharedVideoHeight
        };
    } else {
        return {
            left: ( parentw - sharedVideoWidth * 2 ) / 3 * 2 + sharedVideoWidth,
            top: ( parenth - sharedVideoHeight ) / 2,
            width: sharedVideoWidth,
            height: sharedVideoHeight
        };
    }
}

function reshape1of3( parentw, parenth ) {
    if ( layout == 'p' ) {
        return {
            left: ( parentw - sharedVideoWidth ) / 2,
            top: ( parenth - sharedVideoHeight * 3 ) / 4,
            width: sharedVideoWidth,
            height: sharedVideoHeight
        };
    } else {
        return {
            left: ( parentw - sharedVideoWidth * 2 ) / 3,
            top: ( parenth - sharedVideoHeight * 2 ) / 3,
            width: sharedVideoWidth,
            height: sharedVideoHeight
        };
    }
}

function reshape2of3( parentw, parenth ) {
    if ( layout === 'p' ) {
        return {
            left: ( parentw - sharedVideoWidth ) / 2,
            top: ( parenth - sharedVideoHeight * 3 ) / 4 * 2 + sharedVideoHeight,
            width: sharedVideoWidth,
            height: sharedVideoHeight
        };
    } else {
        return {
            left: ( parentw - sharedVideoWidth * 2 ) / 3 * 2 + sharedVideoWidth,
            top: ( parenth - sharedVideoHeight * 2 ) / 3,
            width: sharedVideoWidth,
            height: sharedVideoHeight
        };
    }
}

function reshape3of3( parentw, parenth ) {
    if ( layout == 'p' ) {
        return {
            left: ( parentw - sharedVideoWidth ) / 2,
            top: ( parenth - sharedVideoHeight * 3 ) / 4 * 3 + sharedVideoHeight * 2,
            width: sharedVideoWidth,
            height: sharedVideoHeight
        };
    } else {
        return {
            left: ( parentw - sharedVideoWidth * 2 ) / 3 * 1.5 + sharedVideoWidth / 2,
            top: ( parenth - sharedVideoHeight * 2 ) / 3 * 2 + sharedVideoHeight,
            width: sharedVideoWidth,
            height: sharedVideoHeight
        };
    }
}

function reshape1of4( parentw, parenth ) {
    return {
        left: ( parentw - sharedVideoWidth * 2 ) / 3,
        top: ( parenth - sharedVideoHeight * 2 ) / 3,
        width: sharedVideoWidth,
        height: sharedVideoHeight
    };
}

function reshape2of4( parentw, parenth ) {
    return {
        left: ( parentw - sharedVideoWidth * 2 ) / 3 * 2 + sharedVideoWidth,
        top: ( parenth - sharedVideoHeight * 2 ) / 3,
        width: sharedVideoWidth,
        height: sharedVideoHeight
    };
}

function reshape3of4( parentw, parenth ) {
    return {
        left: ( parentw - sharedVideoWidth * 2 ) / 3,
        top: ( parenth - sharedVideoHeight * 2 ) / 3 * 2 + sharedVideoHeight,
        width: sharedVideoWidth,
        height: sharedVideoHeight
    };
}

function reshape4of4( parentw, parenth ) {
    return {
        left: ( parentw - sharedVideoWidth * 2 ) / 3 * 2 + sharedVideoWidth,
        top: ( parenth - sharedVideoHeight * 2 ) / 3 * 2 + sharedVideoHeight,
        width: sharedVideoWidth,
        height: sharedVideoHeight
    };
}

var boxUsed = [ true, false, false, false ];
var connectCount = 0;

function setSharedVideoSize( parentw, parenth ) {
    layout = ( ( parentw / aspectRatio ) < parenth ) ? 'p' : 'l';
    var w, h;

    function sizeBy( fullsize, numVideos ) {
        return ( fullsize - margin * ( numVideos + 1 ) ) / numVideos;
    }

    switch ( layout + ( connectCount + 1 ) ) {
        case 'p1':
        case 'l1':
            w = sizeBy( parentw, 1 );
            h = sizeBy( parenth, 1 );
            break;
        case 'l2':
            w = sizeBy( parentw, 2 );
            h = sizeBy( parenth, 1 );
            break;
        case 'p2':
            w = sizeBy( parentw, 1 );
            h = sizeBy( parenth, 2 );
            break;
        case 'p4':
        case 'l4':
        case 'l3':
            w = sizeBy( parentw, 2 );
            h = sizeBy( parenth, 2 );
            break;
        case 'p3':
            w = sizeBy( parentw, 1 );
            h = sizeBy( parenth, 3 );
            break;
    }
    sharedVideoWidth = Math.min( w, h * aspectRatio );
    sharedVideoHeight = Math.min( h, w / aspectRatio );
}

var reshapeThumbs = [
    function( parentw, parenth ) {

        if ( activeBox > 0 ) {
            return setThumbSize( 0.20, 0.01, 0.01, parentw, parenth );
        } else {
            setSharedVideoSize( parentw, parenth );
            switch ( connectCount ) {
                case 0:
                    return reshapeToFullSize( parentw, parenth );
                case 1:
                    return reshape1of2( parentw, parenth );
                case 2:
                    return reshape1of3( parentw, parenth );
                case 3:
                    return reshape1of4( parentw, parenth );
            }
        }
    },
    function( parentw, parenth ) {
        if ( activeBox >= 0 || !boxUsed[1] ) {
            return setThumbSize( 0.20, 0.01, -0.01, parentw, parenth );
        } else {
            switch ( connectCount ) {
                case 1:
                    return reshape2of2( parentw, parenth );
                case 2:
                    return reshape2of3( parentw, parenth );
                case 3:
                    return reshape2of4( parentw, parenth );
            }
        }
    },
    function( parentw, parenth ) {
        if ( activeBox >= 0 || !boxUsed[2] ) {
            return setThumbSize( 0.20, -0.01, 0.01, parentw, parenth );
        } else {
            switch ( connectCount ) {
                case 1:
                    return reshape2of2( parentw, parenth );
                case 2:
                    if ( !boxUsed[1] ) {
                        return reshape2of3( parentw, parenth );
                    } else {
                        return reshape3of3( parentw, parenth );
                    }
                    break;
                case 3:
                    return reshape3of4( parentw, parenth );
            }
        }
    },
    function( parentw, parenth ) {
        if ( activeBox >= 0 || !boxUsed[3] ) {
            return setThumbSize( 0.20, -0.01, -0.01, parentw, parenth );
        } else {
            switch ( connectCount ) {
                case 1:
                    return reshape2of2( parentw, parenth );
                case 2:
                    return reshape3of3( parentw, parenth );
                case 3:
                    return reshape4of4( parentw, parenth );
            }
        }
    }
];

function killButtonReshaper( parentw, parenth ) {
    var imagew = 128;
    var imageh = 128;
    if ( parentw < parenth ) {
        return setThumbSizeButton( 0.1, -0.51, -0.01, parentw, parenth, imagew, imageh );
    } else {
        return setThumbSizeButton( 0.1, -0.01, -0.51, parentw, parenth, imagew, imageh );
    }
}

function muteButtonReshaper( parentw, parenth ) {
    var imagew = 32;
    var imageh = 32;
    if ( parentw < parenth ) {
        return setThumbSizeButton( 0.10, -0.51, 0.01, parentw, parenth, imagew, imageh );
    } else {
        return setThumbSizeButton( 0.10, 0.01, -0.51, parentw, parenth, imagew, imageh );
    }
}

function drawButtonReshaper( parentw, parenth ) {
    var imagew = 32;
    var imageh = 32;
    if ( parentw < parenth ) {
        return setThumbSizeButton( 0.10, -0.51, 0.01, parentw, parenth, imagew, imageh );
    } else {
        return setThumbSizeButton( 0.10, 0.01, -0.51, parentw, parenth, imagew, imageh );
    }
}

function reshapeTextEntryButton( parentw, parenth ) {
    var imagew = 32;
    var imageh = 32;
    if ( parentw < parenth ) {
        return setThumbSizeButton( 0.10, 0.51, 0.01, parentw, parenth, imagew, imageh );
    } else {
        return setThumbSizeButton( 0.10, 0.01, 0.51, parentw, parenth, imagew, imageh );
    }
}

function handleWindowResize() {
    var fullpage = document.getElementById( 'fullpage' );
    fullpage.style.width = window.innerWidth + 'px';
    fullpage.style.height = window.innerHeight + 'px';
    connectCount = easyrtc.getConnectionCount();

    function applyReshape( obj, parentw, parenth ) {
        var myReshape = obj.reshapeMe( parentw, parenth );

        if ( typeof myReshape.left !== 'undefined' ) {
            obj.style.left = Math.round( myReshape.left ) + 'px';
        }
        if ( typeof myReshape.top !== 'undefined' ) {
            obj.style.top = Math.round( myReshape.top ) + 'px';
        }
        if ( typeof myReshape.width !== 'undefined' ) {
            obj.style.width = Math.round( myReshape.width ) + 'px';
        }
        if ( typeof myReshape.height !== 'undefined' ) {
            obj.style.height = Math.round( myReshape.height ) + 'px';
        }

        var n = obj.childNodes.length;

        //console.log('n:', n);
        for ( var i = 0; i < n; i++ ) {
            var childNode = obj.childNodes[i];

            //console.log('childnode:', childNode);
            if ( childNode.reshapeMe ) {
                applyReshape( childNode, myReshape.width, myReshape.height );
            }
        }
    }

    applyReshape( fullpage, window.innerWidth, window.innerHeight );
}

function setReshaper( elementId, reshapeFn ) {
    var element = document.getElementById( elementId );
    if ( !element ) {
        alert( 'Attempt to apply to reshapeFn to non-existent element ' + elementId );
    }
    if ( !reshapeFn ) {
        alert( 'Attempt to apply misnamed reshapeFn to element ' + elementId );
    }
    element.reshapeMe = reshapeFn;
}

function collapseToThumbHelper() {
    if ( activeBox >= 0 ) {
        var id = getIdOfBox( activeBox );
        document.getElementById( id ).style.zIndex = 2;
        setReshaper( id, reshapeThumbs[activeBox] );
        document.getElementById( 'muteButton' ).style.display = 'none';
        document.getElementById( 'killButton' ).style.display = 'none';
        activeBox = -1;
    }
}

function collapseToThumb() {
    collapseToThumbHelper();
    activeBox = -1;
    updateMuteImage( false );
    handleWindowResize();

}

function updateMuteImage( toggle ) {
    var muteButton = document.getElementById( 'muteButton' );
    if ( activeBox > 0 ) {

 // no kill button for self video
        muteButton.style.display = 'block';
        var videoObject = document.getElementById( getIdOfBox( activeBox ) );
        var isMuted = videoObject.muted ? true : false;
        if ( toggle ) {
            isMuted = !isMuted;
            videoObject.muted = isMuted;
        }
        muteButton.src = isMuted ? 'img/button_unmute.png' : 'img/button_mute.png';
    } else {
        muteButton.style.display = 'none';
    }
}

// Focus the selected user through the 'code' system (modme)
//  - called through broadcast receipt of socket.server 'focus'
//  - maps easyrtcid to DOM element for EACH client
//  - note: each client maintains it's own mapping
//    of easyrtcid to DOM element in connectList

function focusUser( rtcid ) {

  var b = _( connectList )
    .filter( function( connectList ) { return connectList.rtcid == rtcid; } )
    .pluck( 'boxno' )
    .value();

   console.log( 'at focusUser with:', rtcid, 'and box is', b );

    whichBox = b;

    var lastActiveBox = activeBox;
    if ( activeBox >= 0 ) {
        collapseToThumbHelper();
    }

       var id = getIdOfBox( whichBox );
       activeBox = whichBox;
       setReshaper( id, reshapeToFullSize );
       document.getElementById( id ).style.zIndex = 1;
       if ( whichBox > 0 ) {
           document.getElementById( 'muteButton' ).style.display = 'block';
           updateMuteImage();
           document.getElementById( 'killButton' ).style.display = 'block';
       }

    expandThumb( whichBox );

    updateMuteImage( false );
    handleWindowResize();
}

function expandThumb( whichBox ) {
  console.log( 'at expandThumb: whichBox=', whichBox, 'local easyRtcID', easyrtc.myEasyrtcid );

 // console.log('expandThumb - local easyRtcID', easyrtc.myEasyrtcid);
    var lastActiveBox = activeBox;
    if ( activeBox >= 0 ) {
        collapseToThumbHelper();
    }

// Changed to only reconfigute windows to thumbs and main center - swh  8/3/15

   //if (lastActiveBox != whichBox) {
//
       var id = getIdOfBox( whichBox );
       activeBox = whichBox;
       setReshaper( id, reshapeToFullSize );
       document.getElementById( id ).style.zIndex = 1;
       if ( whichBox > 0 ) {
           document.getElementById( 'muteButton' ).style.display = 'block';
           updateMuteImage();
           document.getElementById( 'killButton' ).style.display = 'block';
       }

   //}
    updateMuteImage( false );
    handleWindowResize();

    if ( userContext.modMeState === true && modSwitch === true ) {
      console.log( "modMeState:", userContext.modMeState );
      var rtcidToExpand = _( connectList )
      .filter( function( connectList ) { return connectList.boxno == whichBox; } )
      .pluck( 'rtcid' )
      .value();

  //    console.log('Expand Thumb-Sending - modme rtcidToExpand:', rtcidToExpand, ' for boxno:', whichBox);

      var sessionId = socketServer.sessionid;
      socketServer.emit( 'focus', rtcidToExpand, sessionId );

      var usr = whichBox  + 1;
      var modMessage = 'The Moderator has focused User-' + usr;

      //sendModeratorText(modMessage);
      emitMessage( modMessage );
      messageBar( modMessage );
    }
}

function prepVideoBox( whichBox ) {
    var id = getIdOfBox( whichBox );
    setReshaper( id, reshapeThumbs[whichBox] );
    document.getElementById( id ).onclick = function() {
       expandThumb( whichBox );
   };
}

function prepCanvasBox( whichCanvas ) {
    var id = getIdOfCanvas( whichCanvas );
    setReshaper( id, reshapeThumbs[whichCanvas] );
    document.getElementById( id ).onclick = function() {
     expandThumb( whichCanvas );
};
}

function killActiveBox() {
    if ( activeBox > 0 ) {
        var easyrtcid = easyrtc.getIthCaller( activeBox - 1 );
        collapseToThumb();
        setTimeout( function() {
            easyrtc.hangup( easyrtcid );
        }, 400 );
    }
}

function muteActiveBox() {
    updateMuteImage( true );
}

function callEverybodyElse( roomName, otherPeople ) {

    easyrtc.setRoomOccupantListener( null );

 // so we're only called once.

    var list = [];
    var connectCount = 0;

    for ( var easyrtcid in otherPeople ) {
        list.push( easyrtcid );
    }

    //
    // Connect in reverse order. Latter arriving people are more likely to have
    // empty slots.
    //
    function establishConnection( position ) {
        function callSuccess() {
            connectCount++;
            if ( connectCount < maxCALLERS && position > 0 ) {
                establishConnection( position - 1 );
            }
        }

        function callFailure() {
            easyrtc.showError( 'CALL-REJECTED', 'Rejected by other party' );
            if ( connectCount < maxCALLERS && position > 0 ) {
                establishConnection( position - 1 );
            }
        }

        easyrtc.call( list[position], callSuccess, callFailure );

        //console.log('RoomOccList:', easyrtcid, list);

    }
    if ( list.length > 0 ) {
        establishConnection( list.length - 1 );
    }
}

function loginSuccess() {

    //    console.log('Successfully connected');
    expandThumb( 0 );

 // expand the mirror image initially.
}

function cancelText() {
    document.getElementById( 'textentryBox' ).style.display = 'none';
    document.getElementById( 'textEntryButton' ).style.display = 'block';
    $( '#layer-menu-button' ).click();
}

function sendText( e ) {
    document.getElementById( 'textentryBox' ).style.display = 'none';
    document.getElementById( 'textEntryButton' ).style.display = 'block';
    var stringToSend = document.getElementById( 'textentryField' ).value;
    $( '#layer-menu-button' ).click();
    if ( stringToSend && stringToSend !== '' ) {
        for ( var i = 0; i < maxCALLERS; i++ ) {
            var easyrtcid = easyrtc.getIthCaller( i );
            if ( easyrtcid && easyrtcid !== '' ) {
                easyrtc.sendPeerMessage( easyrtcid, 'im', stringToSend );
            }
        }
    }
    return false;
}

function sendModeratorText( moderatorMessage ) {
  for ( var i = 0; i < maxCALLERS; i++ ) {
      var easyrtcid = easyrtc.getIthCaller( i );
      if ( easyrtcid && easyrtcid !== '' ) {
          easyrtc.sendPeerMessage( easyrtcid, 'im', moderatorMessage );
      }
  }
    return false;
}

function showTextEntry() {
    document.getElementById( 'textentryField' ).value = '';
    document.getElementById( 'textentryBox' ).style.display = 'block';
    document.getElementById( 'textEntryButton' ).style.display = 'none';
    document.getElementById( 'textentryField' ).focus();
}

function showMessage( startX, startY, content ) {
    var fullPage = document.getElementById( 'fullpage' );
    var fullW = parseInt( fullPage.offsetWidth );
    var fullH = parseInt( fullPage.offsetHeight );
    var centerEndX = 0.2 * startX + 0.8 * fullW / 2;
    var centerEndY = 0.2 * startY + 0.8 * fullH / 2;

    var cloudObject = document.createElement( 'img' );
    cloudObject.src = 'images/cloud.png';
    cloudObject.style.width = '1px';
    cloudObject.style.height = '1px';
    cloudObject.style.left = startX + 'px';
    cloudObject.style.top = startY + 'px';
    fullPage.appendChild( cloudObject );

    cloudObject.onload = function() {
        cloudObject.style.left = startX + 'px';
        cloudObject.style.top = startY + 'px';
        cloudObject.style.width = '4px';
        cloudObject.style.height = '4px';
        cloudObject.style.opacity = 0.7;
        cloudObject.style.zIndex = 5;
        cloudObject.className = 'transit boxCommon';
        var textObject;

        function removeCloud() {
            if ( textObject ) {
                fullPage.removeChild( textObject );
                fullPage.removeChild( cloudObject );
            }
        }
        setTimeout( function() {
            cloudObject.style.left = centerEndX - fullW / 4 + 'px';
            cloudObject.style.top = centerEndY - fullH / 4 + 'px';
            cloudObject.style.width = ( fullW / 2 ) + 'px';
            cloudObject.style.height = ( fullH / 2 ) + 'px';
        }, 10 );
        setTimeout( function() {
            textObject = document.createElement( 'div' );
            textObject.className = 'boxCommon';
            textObject.style.left = Math.floor( centerEndX - fullW / 8 ) + 'px';
            textObject.style.top = Math.floor( centerEndY ) + 'px';
            textObject.style.fontSize = '36pt';
            textObject.style.width = ( fullW * 0.4 ) + 'px';
            textObject.style.height = ( fullH * 0.4 ) + 'px';
            textObject.style.zIndex = 6;
            textObject.appendChild( document.createTextNode( content ) );
            fullPage.appendChild( textObject );
            textObject.onclick = removeCloud;
            cloudObject.onclick = removeCloud;
        }, 1000 );
        setTimeout( function() {
            cloudObject.style.left = startX + 'px';
            cloudObject.style.top = startY + 'px';
            cloudObject.style.width = '4px';
            cloudObject.style.height = '4px';
            fullPage.removeChild( textObject );
        }, 9000 );
        setTimeout( function() {
            fullPage.removeChild( cloudObject );
        }, 10000 );
    };
}

function messageListener( easyrtcid, msgType, content ) {
    for ( var i = 0; i < maxCALLERS; i++ ) {
        if ( easyrtc.getIthCaller( i ) === easyrtcid ) {
            var startArea = document.getElementById( getIdOfBox( i + 1 ) );
            var startX = parseInt( startArea.offsetLeft ) + parseInt( startArea.offsetWidth ) / 2;
            var startY = parseInt( startArea.offsetTop ) + parseInt( startArea.offsetHeight ) / 2;
            showMessage( startX, startY, content );
        }
    }
}

function appInit() {

  easyrtc.enableDebug( true );

//   Begin experimental camera select
//

var device = {};

function isMobileDevice() {
  var isMobile = false; //initiate as false
// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;
  return isMobile;
    //return ( typeof window.orientation !== 'undefined' ) || (navigator.userAgent.indexOf( 'IEMobile' ) !== -1 );
}

function findBrowserType() {
  var sBrowser, sUsrAg = navigator.userAgent;
  if(sUsrAg.indexOf("Chrome") > -1) {
      sBrowser = "Chrome";
  } else if (sUsrAg.indexOf("Safari") > -1) {
      sBrowser = "Apple Safari";
  } else if (sUsrAg.indexOf("Opera") > -1) {
      sBrowser = "Opera";
  } else if (sUsrAg.indexOf("Firefox") > -1) {
      sBrowser = "Mozilla Firefox";
  } else if (sUsrAg.indexOf("MSIE") > -1) {
      sBrowser = "Microsoft Internet Explorer";
  }
  console.log( 'Browser:', sBrowser );

  return sBrowser;
}

function setBrowserDetails() {
  userContext.browserType = findBrowserType();

  if ( isMobile() ) {
    console.log( 'Mobile Device' );
  userContext.mobile = true;
  }

  if ( navigator.geolocation ) {
    userContext.geoLocation = true;
    }

  if ( window.DeviceMotionEvent ) {
    console.log( 'Device Orientation Event:', window.deviceMotionEvent  )
  userContext.motion = true;
    }

    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
 console.log( 'Mobile Check' );
}

  if ( window.DeviceOrientationEvent ) {
    userContext.orientation = true;
    }

  if ( userContext.orientation === true && userContext.motion === true) {
    userContext.arCapable = true;
    userContext.mobile =  true;
    messageBar( 'Device is AR Capable' );
    }

}

setBrowserDetails();

//function isChromeMobile() {
//  var mobile = isMobileDevice();
//  var browserType = findBrowserType();
//  userContext.browserType = browserType;
//  userContext.mobile = true;
//  if (mobile && browserType === 'Chrome') {
// return true;
//  } else {
//    return false;
//  }
//}
//console.log( 'Chrome and Mobile:', isChromeMobile() );

//      // set the media source
//      // from 3318
//      //easyrtc.addStreamToCall( easyrtcid, streamname, receipthandler)
//      //streamname is the id
//      //var stream = getLocalMediaStreamByName(streamName);
//
//    navigator.getUserMedia = navigator.getUserMedia ||
//      navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
//
//    var videoElement = document.getElementById( 'box0' );
//
//   if ( !MediaStreamTrack.getSources ) {
//       console.log( 'No media stream track enumeration' );
//       return;
//     } else {
//
//     MediaStreamTrack.getSources( gotSources );
//  // }
//
//  function gotSources( sourceInfos ) {
//      console.log( 'static-multi:', sourceInfos ) ;
//      device = _.find( sourceInfos, function( sources ) { return sources.facing == 'environment';} );
//      console.log( 'device:', device );
//      console.log( 'facing:', device.facing );
//      console.log( 'label:', device.label );
//      console.log( 'id:', device.id );
//
//      //
//      //  .....or
//      //
//
//    easyrtc.getVideoSourceList( function(list) {
//      console.log( 'easyrtc.getVideoSourceList:', list );
//      device = _.find( list, function( sources ) { return sources.facing == 'environment';} );
//      console.log( 'easyrtc.getVideoSourceList device-id:', device.id );
//      easyrtc.setVideoSource( device.id );
//      } );
//
//
//
//      var constraints = {
//      //audio: {
//      //  optional: [{
//      //    sourceId: audioSource
//      //  }]
//      //},
//       video: {
//         optional: [{
//           sourceId: device.id
//         }]
//       }
//     };
//
//     function successCallback(stream) {
//        var url = window.URL || window.webkitURL;
//        videoElement.src = url ? url.createObjectURL(stream) : stream;
//        videoElement.play();
//
//     //window.stream = stream; // make stream available to console
//     //videoElement.src = window.URL.createObjectURL(stream);
//     //videoElement.play();
//    }
//
//     function errorCallback(error) {
//     console.log('navigator.getUserMedia error: ', error);
//    }
//
//     navigator.getUserMedia( constraints, successCallback, errorCallback );
//    }
//  }
//
//
//   End experimental camera select
//

 //if ( navigator.geolocation ) {
 //  userContext.geoLocation = true;
 //  }
 //if ( window.DeviceMotionEvent ) {
 //userContext.motion = true;
 //  }
 //if ( window.DeviceOrientationEvent ) {
 //  userContext.orientation = true;
 //  }
 //if ( userContext.orientation === true && userContext.motion === true) {
 //  userContext.arCapable = true;
 //  userContext.mobile =  true;
 //  messageBar( 'Device is AR Capable' );
 //  }

    // Prep for the top-down layout manager
    setReshaper( 'fullpage', reshapeFull );
    for ( var i = 0; i < numVideoOBJS; i++ ) {
        prepVideoBox( i );
    }

    setReshaper( 'killButton', killButtonReshaper );
    setReshaper( 'muteButton', muteButtonReshaper );

    //setReshaper('drawButton', drawButtonReshaper);

    setReshaper( 'textentryBox', reshapeTextEntryBox );
    setReshaper( 'textentryField', reshapeTextEntryField );
    setReshaper( 'textEntryButton', reshapeTextEntryButton );

    updateMuteImage( false );
    window.onresize = handleWindowResize;
    handleWindowResize();

 //initial call of the top-down layout manager

    easyrtc.setRoomOccupantListener( callEverybodyElse );


 //if ( userContext.mobile) {
 // easyrtc.enableAudio( false );
 // }




   easyrtc.easyApp( 'roomDemo', 'box0', [ 'box1', 'box2', 'box3' ],
     function( myId ) {

    console.log( 'Local Media Ids:', easyrtc.getLocalMediaIds()  );

       userContext.rtcId = myId;

//     // First time through for all connections

       if ( boxUsed[0] === true && easyrtc.getConnectionCount() === 0 ) {
         connectList.push( {
           rtcid: myId,
           boxno: 0,
           avatar: 'avatar0'
         } );
       }
     }
   );

   easyrtc.setPeerListener( messageListener );
   easyrtc.setDisconnectListener( function() {
       easyrtc.showError( 'LOST-CONNECTION', 'Lost connection to signaling server' );
   } );

    easyrtc.setOnCall( function( easyrtcid, slot ) {

      //console.log('a call with ' + easyrtcid + 'established');
      //  console.log('Occupant IDs:', easyrtc.getRoomOccupantsAsArray('default'))
        boxUsed[slot + 1] = true;
        var theSlot = slot + 1;
        var theBox =  theSlot;
        var av = 'avatar0';

        //console.log('at setOnCall - rtcid:', easyrtcid, 'theBox:', theBox,'avatar:', av );

       connectList.push( {
        rtcid: easyrtcid,
        boxno: theBox,
        avatar: av
     } );

       //console.log('onCall - ConnectList:', connectList);

// Thumbs for all connections other than initiator
//  -- change to == 1 for normal mode

        if ( activeBox === 0 && easyrtc.getConnectionCount() === 1 ) {
            expandThumb( 0 );
            document.getElementById( 'textEntryButton' ).style.display = 'block';
        }
        document.getElementById( getIdOfBox( slot + 1 ) ).style.visibility = 'visible';
        expandThumb( 0 );
    } );

    easyrtc.setOnHangup( function( easyrtcid, slot ) {
        boxUsed[slot + 1] = false;

        //console.log('hanging up on ' + easyrtcid);
        if ( activeBox > 0 && slot + 1 == activeBox ) {
            collapseToThumb();
        }
        setTimeout( function() {
            document.getElementById( getIdOfBox( slot + 1 ) ).style.visibility = 'hidden';

            if ( easyrtc.getConnectionCount() === 0 ) {

 // no more connections
                expandThumb( 0 );
                document.getElementById( 'textEntryButton' ).style.display = 'none';
                document.getElementById( 'textentryBox' ).style.display = 'none';
            }
            handleWindowResize();
        }, 20 );
    } );

initDraw();
initUtil();
messageBar( 'User Session Initialized' );

}
