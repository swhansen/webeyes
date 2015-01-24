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
//
//var line = {};
//line.x =7;
//line.y =8;
//
//console.log(line);
//
//function Lines(x, y, c, client) {
//  points = [];
//  this.x =x;
//  this.y =y;
//  this.c =c;
//  this.client = client;
//};
//
//
//
//
//var line1 = new Lines(1.1, 1.2, "red", "Bob");
//
//line1.points.push = {x:1.2, y:1.2, c:"yellow", client:"fred"};
//line1.points.push = {x:1.2, y:1.2, c:"red", client:"bob"};
//
//
// console.log("the line is:", line1.x, line1.y, line1.c, line1.client, line1.points);










//function point(x, y, c, client) {
//  this.xcoord = x;
//  this.ycoord = y;
//  this.c = c;
//  this.client = client;
//  this.drawpoint = drawpoint;
//
//}
//function drawpoint() {
//  console.log( this.xcoord, this.ycoord, this.c, this.client);
//}
//
//
///*
//create a mycircle called testcircle where testcircle.xcoord is 3
//and testcircle.ycoord is 4 and testcircle.radius is 5
//*/
//var testpoint = new point(1.1, 1.2, "red", "Fred");
///*
//use the mvBy method to displace the centre of testcircle.
//move it by 2 in the x direction and 3 in the y direction
//*/
////testpoint.drawpoint();





var Line =function (points, c, client){
  this.line = [points];
  this.color = c;
  this.client = client;
  //this.line = points || {};
  this.points = points;
};

Line.prototype.addPoint = function (point) {
  var self = this;
  this.line.push(point);
  return line;
};

Line.prototype.prunePoint = function () {
  var self = this;
  this.line.shift();
  return line;
};




var color = "rgba(215, 44, 244, .2)";


pt1 = [1.1, 1.2];
pt2 = [2.1, 2.1];
pt3 = [3.1, 3.2];

var line1 = new Line(pt1, color, "fred");

//line1.line.push(pt2);
//line1.addPoint(pt1);
line1.addPoint(pt2);
line1.addPoint(pt3);
console.log(line1);
line1.prunePoint();



console.log(line1);



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



