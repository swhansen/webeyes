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
       // t = t + 500;
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











