

// div id= utilcanvaspane
//canvas id = util-canvas

function initGumby() {

var utilCanvas = document.getElementById('util-canvas');
var ctx = utilCanvas.getContext("2d");

  document.getElementById("utilcanvaspane").className = "canvascenter";

  utilCanvas.style.width ='100%';
  utilCanvas.style.height='100%';
  utilCanvas.width  = utilCanvas.offsetWidth;
  utilCanvas.height = utilCanvas.offsetHeight;

  box0Height = document.getElementById("box0").offsetHeight;
  box0Width = document.getElementById("box0").offsetWidth;

  document.getElementById("utilcanvaspane").style.visibility = "visible";
  document.getElementById("utilcanvaspane").offsetHeight = box0Height;
  document.getElementById("utilcanvaspane").offsetWidth = box0Width

  var imageObj = new Image();
 //  imageObj.src = '../img/gumby.jpg';

 var img = document.getElementById("gumby");
    ctx.drawImage(img, 350, 250);

// utility to finf z-index values - caution only css declared
  $('*').filter(function() {
    return $(this).css('z-index') >= 0;
}).each(function() {
    console.log("z-index:", $(this), "is:", $(this).css('z-index'))
});

}
