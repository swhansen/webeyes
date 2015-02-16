
function drawUI() {

//$("#snailButton").fadeIn(2000);
//$("#b1").fadeIn(3000);


$(function() {
    $("#b1" )
      .button({
        label: "Test Button"
      })
      .click(function( event ) {
        alert('clicked button');
      });
  });


// toggle line drawing fade

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