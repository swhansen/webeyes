
// canvas playground for experimental stuff

var utilCanvas = document.getElementById('utilcanvas');
var ctx = utilCanvas.getContext('2d');
var d1 = document.getElementById('doc-1');
var d2 = document.getElementById('doc-2');
var d3 = document.getElementById('material');

//var box0Width;
//var box0Height;

function initUtil() {

  userContext.addDimensionalLayer( 'utilcanvaspane' );

  document.getElementById('utilcanvaspane').className = 'canvascenter';

  utilCanvas.style.width = '100%';
  utilCanvas.style.height = '100%';
  utilCanvas.width = utilCanvas.offsetWidth;
  utilCanvas.height = utilCanvas.offsetHeight;

  box0Height = document.getElementById('box0').offsetHeight;
  box0Width = document.getElementById('box0').offsetWidth;

  document.getElementById('utilcanvaspane').style.visibility = 'visible';
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
    inputAttributes: {
      accept: 'image/*'
    }
      } ).then(function ( file ) {
        var reader = new FileReader();
        var msg = {};
        reader.onload = function ( theFile ) {
          var img = new Image();
          img.onload = function() {
                  canvas.width = img.width;
                  canvas.height = img.height;
                  ctx.drawImage( img, 0, 0 );
                  data = utilCanvas.toDataURL('image/jpg');
                  socketServer.emit('shareImage', data );
                  console.log( 'openFileModal shareImage:', data );
            };
            img.src = event.target.result;
          };
        reader.readAsDataURL( file );
      } );
}




socketServer.on( 'shareImage', function( data ) {
    var img = new Image();
    img.src = data;
    ctx.drawImage(img, 0, 0);

//  console.log( 'util shareImage:', data );
//ctx.drawImage( data, 0, 0 );
} );


function emitUtilImage( data ) {
  var sessionId = socketServer.sessionid;
  socketServer.emit('shareImage', data, sessionId);
}





function drawDoc1() {
  ctx.drawImage( d1, 0, 0, box0Width, box0Height);
}

function drawDoc2() {
  ctx.drawImage(d2, 0, 0, utilCanvas.width, utilCanvas.height);
}

function drawArch() {
  ctx.drawImage(d3, 0, 0 , utilCanvas.width, utilCanvas.height);
}

 function clearUtilCanvas() {
  ctx.clearRect(0, 0, utilCanvas.width, utilCanvas.height);
  emitUtility( 'clearutil' );
}

function drawBullsEye() {
  var outerRadius = 300;
  var innerRadius = 275;
  ctx.beginPath();
  ctx.arc(500, 400, outerRadius, 0, 2 * Math.PI, false);
  ctx.fillStyle = 'rgba(255,255,255,.2)';
  ctx.fill();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(500, 400, innerRadius, 0, 2 * Math.PI, false);
  ctx.fillStyle = 'green';
  ctx.fill();
  ctx.globalCompositeOperation = 'source-over';
  ctx.beginPath();
  ctx.moveTo(500 - innerRadius, 400);
  ctx.lineTo(500 + innerRadius, 400);
  ctx.stroke();
  ctx.moveTo(500, 400 - innerRadius);
  ctx.lineTo(500, 400 + innerRadius);
  ctx.stroke();
}

function emitUtility( data ) {
  var sessionId = socketServer.sessionid;
  socketServer.emit( 'utility', data, sessionId);
}

socketServer.on( 'utility', function(data) {
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
      ctx.clearRect(0, 0, utilCanvas.width, utilCanvas.height);
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

