//
//  Declare the high level UI Structure
//    - Main function buttons (left menu)
//    - Function detail buttons (right menu)
//
var uiStructure = {
  structure: {
    util: {
      mainButton: "#utilButton",
      functions: "#utility-box",
      buttons: ["#utilTestButton"],
      desc: "utility layer",
      initState: "none"
    },
    draw: {
      mainButton: "#drawButton",
      functions: "#draw-box",
      buttons: ["#snailButton", "#b1"],
      desc: "drawing layer",
      initState: "none"
    },
    p1: {
      mainButton: "#div1",
      functions: "#draw-box",
      buttons: [],
      desc: "tmp",
      initState: "none"
    },
    p2: {
      mainButton: "#textEntryButton",
      functions: "",
      buttons: [],
      desc: "tmp",
      initState: "none"
    },
    p3: {
      mainButton: "#muteButton",
      functions: "",
      buttons: [],
      desc: "tmp",
      initState: "none"
    }
  }
};

function buildSideMenu(layer) {

  // remove existing side menu(s)
  // expand right element div and buttons for layer specific menu

  _.each(uiStructure.structure, function(fcn) {
    $(fcn.functions).fadeOut(5);
  });

  $(uiStructure.structure[layer].functions).fadeIn(5);

  _.each(uiStructure.structure[layer].buttons, function(button) {
    $(button).fadeIn(2000);
  });
};

// the main menue collapse-expand

var collapsed = true;

$(document).ready(function() {
  var t = 1000;
  $("#layer-menu-button").click(function() {
    if (collapsed == true) {
      collapsed = false
      for (var button in uiStructure.structure) {
        $(uiStructure.structure[button].mainButton).fadeIn(t);
      }
    } else {
      collapsed = true;
      t = 1000;
      for (var button in uiStructure.structure) {
        t = 1000;
        $(uiStructure.structure[button].mainButton).fadeOut(t);
      }
    }
  });
});

//
//   Utility layer UI
//
function utilUI() {

buildSideMenu('util');

//$( "#draw-box").fadeOut(10);
//$( "#utility-box").fadeIn(10);
//$( "#utilTestButton").fadeIn(2000);
}
//
//   Drawing  Layer UI
//
function drawUI() {

buildSideMenu('draw');

//$(uiStructure.util.functions).fadeOut(50);
//$("#draw-box").fadeIn(10);
//$("#snailButton").fadeIn(2000);
//$("#b1").fadeIn(3000);
}

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

