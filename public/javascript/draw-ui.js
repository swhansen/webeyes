// an experimental slider widget for the drawing control box
function drawUI() {

$("#snailButton").fadeIn(2000);

//$( ".slider" ).slider({
//  animate: true,
//  range: "min",
//  value: 2,
//  min: 1,
//  max: 10,
//  step: 1,
//  //this gets a live reading of the value and prints it on the page
//  slide: function( event, ui ) {
//    $( "#slider-result" ).val( ui.value );
//  },
//  //this updates the hidden form field so we can submit the data using a form
//  change: function(event, ui) {
//    $('#hidden').attr('value', ui.value);
//  }
//  });
//

// toggle fade drawing line

$(function(){
  $( ".img-swap" ).click(function() {
    if ($(this).attr("class") == "img-swap") {
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