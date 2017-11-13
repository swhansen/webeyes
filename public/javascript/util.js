
  'use strict';

// canvas playground for experimental document sharing

// notes: the div and the containing canvas need to be sized to the
// center dimensional window. The size of the windo window is dynamic and
// is set on session initiation.

var d1 = document.getElementById( 'doc-1' );
var d2 = document.getElementById( 'doc-2' );
var d3 = document.getElementById( 'material' );

var docctx;
var docAlpha = 1.0;
var box0Height;
var box0Width;
var docCanvasPane = document.getElementById( 'doccanvaspane' );
var docCanvas = document.getElementById( 'doccanvas' );

function initUtil() {

  // set the dimensionalLayer and canvas based on center box size

  userContext.addDimensionalLayer( 'doccanvaspane' );

  var b = getCenterBoxId();
  var box = $( '#' + b );
  var boxPosition = box.offset();
  var boxWidth = box.outerWidth();
  var boxHeight = box.outerHeight();

  console.log( 'box0-xx', boxWidth, boxHeight );

  box0Height = document.getElementById( 'box0' ).offsetHeight;
  box0Width = document.getElementById( 'box0' ).offsetWidth;

  $( '#doccanvaspane' ).css( boxPosition );
  $( '#doccanvaspane' ).css( 'width', boxWidth );
  $( '#doccanvaspane' ).css( 'height', boxHeight );
  $( '#doccanvaspane' ).css( 'z-index', 50 );

  docCanvas.width = docCanvasPane.clientWidth;
  docCanvas.height = docCanvasPane.clientHeight;

  docCanvasPane.style.visibility = 'visible';

  docctx = docCanvas.getContext( '2d' );
}

function loadUtilImage( utilImage ) {

switch ( utilImage ) {
   case 'doc1':
    emitUtility( 'doc-1' );
    drawDoc1();
   break;
  case 'doc2':
    emitUtility( 'doc-2' );
    drawDoc2();
   break;
  case 'bullseye':
      emitUtility( 'bullseye' );
      drawBullsEye();
   break;
   case 'arch':
      emitUtility( 'arch' );
      drawArch();
   break;
  }
}

function openFileModal() {
  swal( {
    title: 'Select image',
    input: 'file',
    showCancelButton: true,
    inputAttributes: {
      accept: 'image/*'
    }
    } ).then( function( e ) {
        var reader = new FileReader();
        reader.onload = function( event ) {
            var imgSend = new Image();
            imgSend.onload = function() {
                docctx.drawImage( imgSend, 5, 5,  box0Width, box0Height );
                var imgdata = docCanvas.toDataURL( 'image/jpg', 0.5 );
                var data = { sessionId: userContext.sessionId, alpha: docAlpha, width: docCanvas.width, height: docCanvas.height, source:imgdata };
                emitDocImage( data );
            };
            imgSend.src = event.target.result;
        };
        reader.readAsDataURL( e );
      }
      );
}

function setDocAlpha() {
  swal( {
  title: 'Set document load opacity',
  text: 'Opacity will be set for broadcast images',
  showCancelButton: true,
  input: 'range',
  inputAttributes: {
    min: 0.1,
    max: 1.0,
    step: 0.1
  },
  inputValue: docAlpha
  } ).then( function( inputValue ) {
    docAlpha = inputValue;
    docctx.globalAlpha = inputValue;

  //  console.log( 'docctx.globalAlpha:', docctx.globalAlpha );
  } );
}

socketServer.on( 'shareImage', function( data ) {
  var imgRecieve = new Image();
  var origDocAlpha = docAlpha;
  docctx.globalAlpha = data.alpha;
  imgRecieve.onload = start;
  imgRecieve.src = data.source;
  function start() {
    if ( !imgRecieve ) { console.log( 'no data over the pipe' ); }
    docctx.drawImage( imgRecieve, 0, 0, box0Width, box0Height );
    docAlpha = origDocAlpha;
    }
  } );

function emitDocImage( data ) {

 // console.log( 'emitdocImage:', data.width, data.height, data.source );
  var sessionId = socketServer.sessionid;
  socketServer.emit( 'shareImage', data, sessionId );
}

function drawDoc1() {
  docctx.drawImage( d1, 0, 0, box0Width, box0Height );
}

function drawDoc2() {
  docctx.drawImage( d2, 0, 0, box0Width, box0Height );
}

function drawArch() {
  docctx.drawImage( d3, 0, 0, box0Width, box0Height );
}

 function clearUtilCanvas() {
  docctx.clearRect( 0, 0, box0Width, box0Height );
  emitUtility( 'clearutil' );
}

function drawBullsEye() {

  var b = getCenterBoxId();
  var box = $( '#' + b );
  var cw = box.outerWidth() / 2.0;
  var ch = box.outerHeight() / 2.0;
  var outerRadius = 300;
  var innerRadius = 275;

  docctx.beginPath();
  docctx.arc( cw, ch, outerRadius, 0, 2 * Math.PI, false );
  docctx.fillStyle = 'rgba(255,255,255,.2)';
  docctx.fill();
  docctx.globalCompositeOperation = 'destination-out';
  docctx.beginPath();
  docctx.arc( cw, ch, innerRadius, 0, 2 * Math.PI, false );
  docctx.fillStyle = 'green';
  docctx.fill();
  docctx.globalCompositeOperation = 'source-over';
  docctx.beginPath();
  docctx.moveTo( cw - innerRadius, ch );
  docctx.lineTo( cw + innerRadius, ch );
  docctx.stroke();
  docctx.moveTo( cw, ch - innerRadius );
  docctx.lineTo( cw, ch + innerRadius );
  docctx.stroke();
}

function emitUtility( data ) {
  var sessionId = socketServer.sessionid;
  let emitUtil = {};
  emitUtil.data = data;
  emitUtil.sessionId = userContext.sessionId
  socketServer.emit( 'utility', emitUtil, sessionId );
}

socketServer.on( 'utility', function( data ) {

console.log( 'ss.on - utility:', data );

  switch ( data.data ) {
    case 'statusbox':
      updateStatusBox( data );
    break;
    case 'bullseye':
      drawBullsEye();
    break;
    case 'doc-1':
      drawDoc1();
    break;
    case 'doc-2':
      drawDoc2();
    break;
    case 'arch':
      drawArch();
    break;
    case 'clearutil':
      clearDrawCanvas();
      docctx.clearRect( 0, 0, box0Width, box0Height );
    break;
    case 'clearmoderator':
      statusBox.updateElement( 'ismoderator', '' );
      userContext.modMeState = false;
    break;
    case 'arClientInit':
        loadAr( 'peer' );
    break;
    case 'vrClientInit':
        loadAr( 'peer' );
    break;
    case 'leapClientInit':

    // not the leap owner and not mobile( performance )
    if ( !userContext.isLeap && !userContext.mobile ) {
        initLeapPeerHand();
      }
    break;
  }
} );

