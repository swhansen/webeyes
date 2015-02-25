
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


//function updateMuteImage(toggle) {
//    var muteButton = document.getElementById('muteButton');
//    if (activeBox > 0) { // no kill button for self video
//        muteButton.style.display = "block";
//        var videoObject = document.getElementById(getIdOfBox(activeBox));
//        var isMuted = videoObject.muted ? true : false;
//        if (toggle) {
//            isMuted = !isMuted;
//            videoObject.muted = isMuted;
//        }
//        muteButton.src = isMuted ? "images/button_unmute.png" : "images/button_mute.png";
//    } else {
//        muteButton.style.display = "none";
//    }
//}