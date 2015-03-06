//
//  Declare the high level UI Structure
//    - Main function buttons (left menu)
//    - Function detail buttons (right menu)
//
var uiStructure = {
  structure: {
    util: {
      mainButton: "#utilButton",
      functions: "#utility-container",
      buttons: ["#utilTestButton", "#bullseye"],
      desc: "utility layer",
      initState: "none",
      baseZ: "20"
    },
    draw: {
      mainButton: "#drawButton",
      functions: "#draw-ui-container",
      buttons: ["#snailButton", "#b1"],
      desc: "drawing layer",
      initState: "none",
      baseZ: "20"
    },
    p1: {
      mainButton: "#div1",
      functions: "#draw-ui-container",
      buttons: [],
      desc: "tmp",
      initState: "none",
      baseZ: "20"
    },
    p2: {
      mainButton: "#textEntryButton",
      functions: "",
      buttons: [],
      desc: "tmp",
      initState: "none",
      baseZ: "20"
    },
    p3: {
      mainButton: "#muteButton",
      functions: "",
      buttons: [],
      desc: "tmp",
      initState: "none",
      baseZ: "20"
    }
  }
};

var data = document.querySelector('#geo-data');

function log(message){
  data.innerHTML += message + '<br />' + data.innerHTML;
}

navigator.geolocation.watchPosition(logPosition);

function logPosition(position){
  console.log(position);
  log(position.coords.latitude + '<br />' + position.coords.longitude);
}

function buildSideMenu(layer) {

  // remove existing side menu(s)
  // expand right element div and buttons for layer specific menu
  // collapse main menu

  _.each(uiStructure.structure, function (fcn) {
    $(fcn.functions).fadeOut(5);
  });

  $("#layer-menu-button").trigger("click");

  $(uiStructure.structure[layer].functions).fadeIn(5);

  _.each(uiStructure.structure[layer].buttons, function (button) {
    $(button).fadeIn(2000);
  });
}

// the main menue collapse-expand

var collapsed = true;

$(document).ready(function () {
  var t = 1000;
  $("#layer-menu-button").click(function () {
    var button;
    if (collapsed === true) {
      collapsed = false;
      for (button in uiStructure.structure) {
        $(uiStructure.structure[button].mainButton).fadeIn(t);
      }
    } else {
      collapsed = true;
      t = 1000;
      for (button in uiStructure.structure) {
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
}
//
//   Drawing  Layer UI
//
function drawUI() {
buildSideMenu('draw');
}

  //toggle switch to render Gumby

  $(function() {
    $(".gumby-swap").click(function () {
      if ($(this).attr("class") == "gumby-swap") {
        //this.src = this.src.replace("img/gumby-on", "img/gumby-off");
        //drawGumby();
        emitUtility('gumby');
      } else {
        //this.src = this.src.replace("img/gumby-off", "img/gumby-on");
        clearUtilCanvas();
      }
      $(this).toggleClass("on");
    });
  });

  $(function() {
    $(".bullseye-swap").click(function () {
      if ($(this).attr("class") == "bullseye-swap") {
        //this.src = this.src.replace("img/bullseye", "img/bullseye");
        //drawBullsEye();
        emitUtility('bullseye');
      } else {
        //this.src = this.src.replace("img/bullseye", "img/bullseye");
        clearUtilCanvas();
      }
      $(this).toggleClass("on");
    });
  });

  $(function () {
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
    $(".fade-swap").click(function () {
      if ($(this).attr("class") == "fade-swap") {
        this.src = this.src.replace("img/erase-on", "img/erase-off");
        fadeSwitch = false;
        toggleFade();
      } else {
        this.src = this.src.replace("img/erase-off", "img/erase-on");
        fadeSwitch = true;
        toggleFade();
      }
      $(this).toggleClass("on");
    });
  });

// invite dialog

  $(function() {
    $("#div1").click( function () {
     $( "#dialog" ).dialog();
  });
  });

