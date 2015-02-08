

// div id= utilcanvaspane
// canvas id = util-canvas

function initUtil() {

  $("#utilSideButton").fadeIn(2000);

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

 var img = document.getElementById("gumby");

//toggle switch to render Gumby

$(function(){
  $( ".util-swap" ).click(function() {
    if ($(this).attr("class") == "util-swap") {
     this.src = this.src.replace("img/gumby-on","img/gumby-off");
     ctx.drawImage(img, 600, 100);
    } else {
      this.src = this.src.replace("img/gumby-off","img/gumby-on");
     ctx.clearRect ( 0 , 0 , utilCanvas.width, utilCanvas.height );
    }
    $(this).toggleClass("on");
  });
});
}