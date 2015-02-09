// an experimental slider widget for the drawing control box
function drawUI() {

$("#snailButton").fadeIn(2000);

$(function(){
  $( ".fade-swap" ).click(function() {
    if ($(this).attr("class") == "fade-swap") {
      this.src = this.src.replace("img/snail-on","img/snail-off");
      fadeSwitch = false;
      toggleFade();
    } else {
      this.src = this.src.replace("img/snail-off","img/snail-on");
      fadeSwitch = true;
      toggleFade();
    }
    $(this).toggleClass("on");
  });
});
}