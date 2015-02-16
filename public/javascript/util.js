var utilCanvas = document.getElementById('util-canvas');
var ctx = utilCanvas.getContext("2d");
var img = document.getElementById("gumby");


function initUtil() {

 // $("#utilSideButton").fadeIn(2000);

  document.getElementById("utilcanvaspane").className = "canvascenter";

  utilCanvas.style.width = '100%';
  utilCanvas.style.height = '100%';
  utilCanvas.width = utilCanvas.offsetWidth;
  utilCanvas.height = utilCanvas.offsetHeight;

  box0Height = document.getElementById("box0").offsetHeight;
  box0Width = document.getElementById("box0").offsetWidth;

  document.getElementById("utilcanvaspane").style.visibility = "visible";
  document.getElementById("utilcanvaspane").offsetHeight = box0Height;
  document.getElementById("utilcanvaspane").offsetWidth = box0Width

  utilUI();
}

function drawGumby() {
  ctx.drawImage(img, 600, 100);
}

function clearGumby() {
  ctx.clearRect(0, 0, utilCanvas.width, utilCanvas.height);
}