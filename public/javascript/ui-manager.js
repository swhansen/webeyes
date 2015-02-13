var layerFunctions = {
  p1: "#div1",
  p2: "#div2",
  p3: "#div3",
  draw: "#drawButton",
  //text: "#textButton",
  text: "#utilButton"
}

var drawFunctions = {
  p1: "#pause-fade",
  p2: "#div2",
  p3: "#div3",
  draw: "#d-button"
}

//frob = _.map(layerFunctions, function(num, key){return num;});
//console.log("frob map:", frob);

// the main menue collapse-expand

var collapsed = true;

$(document).ready(function() {
  var t = 1000;
  $("#layer-menu-button").click(function() {
    if (collapsed == true) {
      collapsed = false
      for (var prop in layerFunctions) {
        $(layerFunctions[prop]).fadeIn(t);
      }
    } else {
      collapsed = true;
      t = 1000;
      for (var prop in layerFunctions) {
        t = 1000;
        $(layerFunctions[prop]).fadeOut(t);
      }
    }
  });
});

//
//   Uitility layer
//
// div id= utilcanvaspane
// canvas id = util-canvas
function utilUI() {

  $("#utilSideButton").fadeIn(2000);
  //toggle switch to render Gumby

  $(function() {
    $(".util-swap").click(function() {
      if ($(this).attr("class") == "util-swap") {
        this.src = this.src.replace("img/gumby-on", "img/gumby-off");
        drawGumby();
      } else {
        this.src = this.src.replace("img/gumby-off", "img/gumby-on");
        clearGumby();
      }
      $(this).toggleClass("on");
    });
  });
}

//
//   Drawing UI
//
function drawUI() {

  $("#snailButton").fadeIn(2000);
  $("#b1").fadeIn(3000);


  $(function() {
    $("#b1")
      .button({
        label: "Test Button"
      })
      .click(function(event) {
        alert('clicked button');
      });
  });

  // toggle line drawing fade

  $(function() {
    $(".fade-swap").click(function() {
      if ($(this).attr("class") == "fade-swap") {
        this.src = this.src.replace("img/snail-on", "img/snail-off");
        fadeSwitch = false;
        toggleFade();
      } else {
        this.src = this.src.replace("img/snail-off", "img/snail-on");
        fadeSwitch = true;
        toggleFade();
      }
      $(this).toggleClass("on");
    });
  });
}