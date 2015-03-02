// div id= utilcanvaspane
// canvas id = util-canvas

function initGumby() {

  var utilCanvas = document.getElementById('util-canvas');
  var ctx = utilCanvas.getContext("2d");

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

  var imageObj = new Image();
  //  imageObj.src = '../img/gumby.jpg';

  var img = document.getElementById("gumby");
  ctx.drawImage(img, 600, 100);

  // utility to find z-index values - caution only css declared
  $('*').filter(function() {
    return $(this).css('z-index') >= 0;
  }).each(function() {
    console.log("z-index:", $(this), "is:", $(this).css('z-index'))
  });
}

function drawBullseye() {
  var outerRadius = 300
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