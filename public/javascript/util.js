
// canvas playground for experimental stuff

var utilCanvas = document.getElementById('utilcanvas');
var utilctx = utilCanvas.getContext('2d');
var d1 = document.getElementById('doc-1');
var d2 = document.getElementById('doc-2');
var d3 = document.getElementById('material');

//var box0Width;
//var box0Height;

function initUtil() {

  userContext.addDimensionalLayer( 'utilcanvaspane' );

  document.getElementById('utilcanvaspane').className = 'canvascenter';

// utilCanvas.style.width = '100%';
// utilCanvas.style.height = '100%';
// utilCanvas.width = utilCanvas.offsetWidth;
// utilCanvas.height = utilCanvas.offsetHeight;

  //var ucp = $( '#utilcanvaspane');
  var b0 = $( '#box0');

  $( '#utilcanvaspane').position = b0.position;

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
    } ).then( function (e) {
        var reader = new FileReader();
        reader.onload = function(event){
            var img = new Image();
            img.onload = function(){
              //  utilCanvas.width = box.width;
              //  utilCanvas.height = img.height;
              utilctx.globalAlpha = 0.5;
                utilctx.drawImage(img, b0.width, bo.height );
                imgdata = utilCanvas.toDataURL();
                var data = {  width: utilCanvas.width, height: utilCanvas.height, source:imgdata };
                emitUtilImage( data );
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL( e );
      }
      );
}

socketServer.on( 'shareImage', function( data ) {
  // image( 'fred', data.source );
  return new Promise(function(resolve, reject) {
    img = new Image( 300, 300 );
   img.width = box0.width;
   img.height = box0.height;
   img.src = data.source;
    utilctx.drawImage( img, 0, 0 );
  if ( data) {
      resolve("Stuff worked!");
    }
    else {
      reject(Error("It broke"));
    }

  promise.then(function(result) {
    console.log(result); // "Stuff worked!"
  }, function(err) {
      console.log(err); // Error: "It broke"
  });
     //console.log( 'shareImage-on:', err);
  } );
} );


//function image (from, base64Image) {
//    $('#lines').append($('<p>').append($('<b>').text(from), '<img src="' + base64Image + '"/>'));
//  }

function emitUtilImage( data ) {
  //console.log( 'emitUtilImage:', data.width, data.height, data.source );
  var sessionId = socketServer.sessionid;
  socketServer.emit('shareImage', data, sessionId);
}

function drawDoc1() {
  utilctx.drawImage( d1, 0, 0, box0Width, box0Height);
}

function drawDoc2() {
  utilctx.drawImage(d2, 0, 0, utilCanvas.width, utilCanvas.height);
}

function drawArch() {
  utilctx.drawImage(d3, 0, 0 , utilCanvas.width, utilCanvas.height);
}

 function clearUtilCanvas() {
  utilctx.clearRect(0, 0, utilCanvas.width, utilCanvas.height);
  emitUtility( 'clearutil' );
}

function drawBullsEye() {
  var outerRadius = 300;
  var innerRadius = 275;
  utilctx.beginPath();
  utilctx.arc(500, 400, outerRadius, 0, 2 * Math.PI, false);
  utilctx.fillStyle = 'rgba(255,255,255,.2)';
  utilctx.fill();
  utilctx.globalCompositeOperation = 'destination-out';
  utilctx.beginPath();
  utilctx.arc(500, 400, innerRadius, 0, 2 * Math.PI, false);
  utilctx.fillStyle = 'green';
  utilctx.fill();
  utilctx.globalCompositeOperation = 'source-over';
  utilctx.beginPath();
  utilctx.moveTo(500 - innerRadius, 400);
  utilctx.lineTo(500 + innerRadius, 400);
  utilctx.stroke();
  utilctx.moveTo(500, 400 - innerRadius);
  utilctx.lineTo(500, 400 + innerRadius);
  utilctx.stroke();
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
      utilctx.clearRect(0, 0, utilCanvas.width, utilCanvas.height);
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

