
// canvas playground for experimental document sharing

// notes: the div and the containing canvas need to be sized to the
// center dimensional window. The size of the windo window is dynamic and
// is set on session initiation.

//var utilCanvas = document.getElementById( 'utilcanvas' );
//var utilctx = utilCanvas.getContext( '2d' );
var d1 = document.getElementById('doc-1');
var d2 = document.getElementById('doc-2');
var d3 = document.getElementById('material');

var docctx;
var box0Height;
var box0Width;
var docCanvasPane = document.getElementById( 'doccanvaspane' );
var docCanvas = document.getElementById( 'doccanvas' );

function initUtil() {

  // set the dimensionalLayer and canvas based on center box size

  userContext.addDimensionalLayer( 'doccanvaspane' );

  var box = $( '#box0' );
  var boxPosition = box.offset();
  var boxWidth = box.outerWidth();
  var boxHeight = box.outerHeight();

  box0Height = document.getElementById('box0').offsetHeight;
  box0Width = document.getElementById('box0').offsetWidth;

  $( '#doccanvaspane' ).css( boxPosition );
  $( '#doccanvaspane' ).css( 'width', boxWidth );
  $( '#doccanvaspane' ).css( 'height', boxHeight );
  $( '#doccanvaspane' ).css( 'z-index', 50);

  docCanvas.width = docCanvasPane.clientWidth;
  docCanvas.height = docCanvasPane.clientHeight;

  docctx = docCanvas.getContext('2d');
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
    } ).then( function (e) {
        var reader = new FileReader();
        reader.onload = function(event){
            var imgSend = new Image();
            imgSend.onload = function(){
                docctx.drawImage( imgSend, 5, 5,  box0Width, box0Height );
              var imgdata = docCanvas.toDataURL();

             //   console.log( 'imagedata at modal:', imgdata );
                var data = {  width: docCanvas.width, height: docCanvas.height, source:imgdata };
                emitDocImage( data );
            };
            imgSend.src = event.target.result;
        };
        reader.readAsDataURL( e );
      }
      );
}

socketServer.on( 'shareImage', function( data ) {

  return new Promise(function(resolve, reject) {
    var imgRecieve = new Image();
 //  img.width = $( '#box0' ).outerWidth();
 //  img.height = $( '#box0' ).outerHeight();
  imgRecieve.width = data.width;
   imgRecieve.height = data.height;
   imgRecieve.src = data.source;

    docctx.drawImage( imgRecieve, 0, 0, data.width, data.height, 0, 0, box0Width, box0Height );
    console.log( 'recieve shareImage-on:', data.width, data.height, box0Width, box0Height );
  if ( data) {
      resolve( 'Stuff worked!' );
    }
    else {
      reject(Error( 'It broke' ));
    }
  promise.then(function(result) {
    console.log(result); // "Stuff worked!"
  }, function(err) {
      console.log(err); // Error: "It broke"
  } );
     //console.log( 'shareImage-on:', err);
  } );
} );

function emitDocImage( data ) {
 // console.log( 'emitdocImage:', data.width, data.height, data.source );
  var sessionId = socketServer.sessionid;
  socketServer.emit( 'shareImage', data, sessionId );
}

function drawDoc1() {
  docctx.drawImage( d1, 0, 0, box0Width, box0Height);
}

function drawDoc2() {
  docctx.drawImage(d2, 0, 0, box0Width, box0Height );
}

function drawArch() {
  docctx.drawImage(d3, 0, 0 , box0Width, box0Height );
}

 function clearUtilCanvas() {
  docctx.clearRect(0, 0, box0Width, box0Height );
  emitUtility( 'clearutil' );
}

function drawBullsEye() {
  var outerRadius = 300;
  var innerRadius = 275;
  docctx.beginPath();
  docctx.arc(500, 400, outerRadius, 0, 2 * Math.PI, false);
  docctx.fillStyle = 'rgba(255,255,255,.2)';
  docctx.fill();
  docctx.globalCompositeOperation = 'destination-out';
  docctx.beginPath();
  docctx.arc(500, 400, innerRadius, 0, 2 * Math.PI, false);
  docctx.fillStyle = 'green';
  docctx.fill();
  docctx.globalCompositeOperation = 'source-over';
  docctx.beginPath();
  docctx.moveTo(500 - innerRadius, 400);
  docctx.lineTo(500 + innerRadius, 400);
  docctx.stroke();
  docctx.moveTo(500, 400 - innerRadius);
  docctx.lineTo(500, 400 + innerRadius);
  docctx.stroke();
  console.log( 'drawBullsEye - end:' );
}

function emitUtility( data ) {
  var sessionId = socketServer.sessionid;
  socketServer.emit( 'utility', data, sessionId);
}

socketServer.on( 'utility', function( data ) {
  switch ( data ) {
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
      docctx.clearRect(0, 0, box0Width, box0Height);
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

