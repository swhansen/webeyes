
// canvas playground for experimental stuff

var utilCanvas = document.getElementById('util-canvas');
var ctx = utilCanvas.getContext("2d");
var d1 = document.getElementById("doc-1");
var d2 = document.getElementById("doc-2");
var d3 = document.getElementById("material");

var box0Width;
var box0Height;

function initUtil() {

  document.getElementById("utilcanvaspane").className = "canvascenter";

  utilCanvas.style.width = '100%';
  utilCanvas.style.height = '100%';
  utilCanvas.width = utilCanvas.offsetWidth;
  utilCanvas.height = utilCanvas.offsetHeight;

  box0Height = document.getElementById("box0").offsetHeight;
  box0Width = document.getElementById("box0").offsetWidth;

  document.getElementById("utilcanvaspane").style.visibility = "visible";
  document.getElementById("utilcanvaspane").offsetHeight = box0Height;
  document.getElementById("utilcanvaspane").offsetWidth = box0Width;
}

function drawDoc1() {
  ctx.drawImage(d1, 0, 0, utilCanvas.width, utilCanvas.height);
}

function drawDoc2() {
  ctx.drawImage(d2, 0, 0, utilCanvas.width, utilCanvas.height);
}

function drawArch() {
  ctx.drawImage(d3, 0, 0 , utilCanvas.width, utilCanvas.height);
}

function clearUtilCanvas() {
  ctx.clearRect(0, 0, utilCanvas.width, utilCanvas.height);
}

function drawBullsEye() {
  var outerRadius = 300;
  var innerRadius = 275;
  ctx.beginPath();
  ctx.arc(500, 400, outerRadius, 0, 2 * Math.PI, false);
  ctx.fillStyle = 'rgba(255,255,255,.2)';
  ctx.fill();
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(500, 400, innerRadius, 0, 2 * Math.PI, false);
  ctx.fillStyle = 'green';
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";
  ctx.beginPath();
  ctx.moveTo(500 - innerRadius, 400);
  ctx.lineTo(500 + innerRadius, 400);
  ctx.stroke();
  ctx.moveTo(500, 400 - innerRadius);
  ctx.lineTo(500, 400 + innerRadius);
  ctx.stroke();
}

function emitUtility(data) {
  var sessionId = socketServer.sessionid;
 // console.log("emitUtility:", data);
  socketServer.emit('utility', data, sessionId);
}

socketServer.on('utility', function(data) {
  switch (data) {
    case "bullseye":
      drawBullsEye();
      break;
    case "doc-1":
      drawDoc1();
      break;
    case "doc-2":
      drawDoc2();
      break;
    case "arch":
      drawArch();
      break;
      case "reset":
      clearUtilCanvas();
      clearDrawCanvas();
      break;
    case "arClientInit":
      if (userContext.participantState === 'peer') {
        coreAr();
      }
      break;
  }
});

