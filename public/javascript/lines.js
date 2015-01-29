//if (window.jQuery) {
//    console.log("jquery IS loaded");
//} else {
//    console.log("jquery NOT loaded");
//}

//typeof _  == "function" ? console.log('underscore yes') : console.log('underscore no');
//
//var scores = [84, 99, 91, 65, 87, 55, 72, 68, 95, 42], topScorers = [], scoreLimit = 90;
//
//topScorers = _(scores).select(function(score){ return score > scoreLimit;});
//
//console.log("topscore:", topScorers);
//
//var Tuts = [{name : 'NetTuts', niche : 'Web Development'}, {name : 'WPTuts', niche : 'WordPress'}, {name : 'PSDTuts', niche : 'PhotoShop'}, {name : 'AeTuts', niche : 'After Effects'}];
//var niches = _.pluck(Tuts, 'niche');
//console.log(niches);

//var xlist = _.pluck(points, 'x');
//console.log(xlist);


//function canvasState() {};
//
//
//var points = [];
//
//points.push({x:1.2, y:1.2, c:"yellow", client:"fred"});
//points.push({x:2.2, y:2.2, c:"green", client:"bill"});
//points.push({x:2.2, y:2.2, c:"green", client:"bill"});
//points.push({x:2.2, y:2.2, c:"green", client:"bill"});
//
//
//console.log(points);
//
//
////var clients = _.pluck(points, 'client');
////console.log(clients);
//

frob = parseInt(0);
console.log(frob);


frob = parseInt(0.5);
console.log(frob);
frob = parseInt(1);
console.log(frob);


// points are a comma seperated array [1.1, 1.2]
// c is rgba string rgba(215, 44, 244, .2)"
// client is the client id from the server

var Line = function (x, y , c, client){
  this.x = x;
  this.y = y;
  this.points = [x, y];
  this.color = c;
  this.client = client;

  //this.line = points || {};
  //this.points = points;
};

Line.prototype.addPoint = function (point) {
  var self = this;
  this.points.push(point);
  return this.line;
};

Line.prototype.listLines = function (point) {
  var self = this;
  return this.lineList;
};

Line.prototype.pruneLine = function () {
  var self = this;
  this.points.shift();
  return this.points;
};

Line.prototype.getAlpha = function () {
  this.lineList;
  alpha = this.lineList.color.replace(/^.*,(.+)\)/,'$1');
  return alpha;
};



Line.prototype.setAlpha = function (alpha) {
  var self = this;
  this.color
  this.alpha
  a = alpha + ")";
  this.color = this.color.replace(/[\d\.]+\)$/g, a);
  return this.line;
};

// decriment length and alpha
// remove one point
//decriment the alpha
// alpha = currentAlpha - current alpha /lineLenght

Line.prototype.decrimentLine = function () {
  var self = this;
  alpha = this.color.replace(/^.*,(.+)\)/,'$1');
  length = this.points.length;
  if (length > 0) {
  a = alpha - (1 / length);
  if ((length <= 0) || (a < 0)) a = 0.0;
}
  this.points.shift();
  this.setAlpha(a);
};


var color = "rgba(215, 44, 244, 1.0)";

//pt1 = [x: 1.1, y: 1.2];
//pt2 = [x: 2.1, y: 2.1];
//pt3 = [x: 3.1, y: 3.2];
//pt4 = [x: 4.1, y: 4.2];
//pt5 = [x: 5.1, y: 5.2];
//pt5 = [x:5.1, y: 5.2];

var lineArray = [];

lineArray.push(new Line(1, 2, color, "mo"));
//lineArray.push(new Line(pt1, color, "larry"));
//lineArray.push(new Line(pt1, color, "curley"));
//lineArray.push(new Line(pt1, color, "shemp"));
//lineArray.push(new Line(pt1, color, "Wilber"));



//line[i] = new Line(pt1, color, "phil");

//console.log("line 0:", lineArray[0]);
//console.log("line 1:", lineArray[1]);
//console.log("lineArray:", lineArray);

////line1.line.push(pt2);
////line1.addPoint(pt1);
//lineArray[0].addPoint(pt1);
//lineArray[0].addPoint(pt1);
//lineArray[0].addPoint(pt3);
//lineArray[0].addPoint(pt3);

//lineArray[2].addPoint(pt2);
//lineArray[3].addPoint(pt3);
//lineArray[3].addPoint(pt3);
//lineArray[3].addPoint(pt3);
////console.log(lineArray[0]);
////line[0].pruneLine();
//lineArray[0].setAlpha(1.0);
////
//lineArray[0].decrimentLine();
////
////console.log(lineArray[0]);
//
//console.log("alpha is:", lineArray[0].getAlpha());
//

function decrimentLineArray () {
  for (i = 0; i < lineArray.length; i++){
    lineArray[i].decrimentLine();
  }
}


function listAPoints(){
for (i = 0; i < lineArray.length; i++){
  //  console.log(lineArray[i].points);
   // console.log(lineArray[i].color);
  }
}


listAPoints();
//decrimentLineArray();
//console.log("First Decriment");
//listAPoints();
//decrimentLineArray();
//console.log("Second Decriment");
//listAPoints();





//console.log(lineArray);

//for (i = 0; i < lineArray.length; i++){
//  lineArray[i].decrimentLine();
// console.log(lineArray[i]);
//}

//for (i = 0; i < lineArray.length; i++){
 // lineArray[i].decrimentLine();
// console.log(lineArray[i]);
//}
////
////console.log("line 1:", line[1]);
//
//console.log("line 1 - alpha:", lineArray[1].getAlpha());
//
//
//line1 = new Line(pt1, color, "mo");
//line2 = new Line(pt2, color, "larry");
//line3 = new Line(pt3, color, "curley");




//function line(x, y, c, client) {
//  var self = this;
//  this.x = x;
//  this.y= y;
//  this.color = c;
//  this.client = client;
// }
//
//var line1 = new line(1.2, 2.1, "yellow", "fred");
//console.log(line1);
//line1.push({x:1.2, y:2.1, c:"yellow", client:"fred"});
//console.log(line1);



//var x = new Array(10);
//for (var i = 0; i < 10; i++) {
//  x[i] = new Array(2);
//}
//x[1, 0] = 2;
//x[1, 1] = 1;
//
//console.log("x is:", x[1 , 0], "," , x[1,1]);
//
//function create2DArray(rows,columns) {
//   var x = new Array(rows);
//   for (var i = 0; i < rows; i++) {
//       x[i] = new Array(columns);
//   }
//   return x;
//}
//
//foo = create2DArray(3, 2);
//console.log(foo);
//
//s = 0;
//s += 0.50;
//console.log(s);
//    var ss = parseInt(s);
//    console.log(ss)



