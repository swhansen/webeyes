var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var io = require("socket.io");
var easyrtc = require("easyrtc");

app.use("/js", express.static(__dirname + '/easyrtc/js'));
app.use("/images", express.static(__dirname + '/easyrtc/images'));
app.use("/css", express.static(__dirname + '/easyrtc/css'));

app.use("/css", express.static(__dirname + '/public/css'));
app.use("/img", express.static(__dirname + '/public/img'));

app.get('/style.css', function (req, res) {
  res.sendFile(__dirname + '../public/css/style.css');
});

// Needed to parse form data(changed for express 4.x)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var loggedIn = false;
var password = 'weg2rt';

var handlebars = require('express-handlebars')
        .create({ defaultLayout: 'main' });

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

//Test home page
//app.get('/', function (req, res) {
//  if (loggedIn === true) {
//    res.render('index', {
//      title: 'available',
//      message: "WEG2RT is ready to go"
//    });
//    console.log("homepage -logged in");
//  } else {
//    res.render('index', {
//      title: 'not',
//      message: "WEG2RT does not have anyone logged in"
//    });
//    console.log("homepage -not logged in");
//  }
//});

// Main entry point
app.get('/', function (req, res) {
  console.log('Login attempt');
  if (loggedIn === true) {
    res.sendfile(__dirname + '/views/multiparty.html');
  } else {
  res.render('entry');
}
});

//Respond to POST from login form
app.post('/', function (req, res) {
  if (loggedIn === true) {
    res.send("Already logged in.");
  } else {
    console.log("Posted data:" + JSON.stringify(req.body));
    if (req.body.pw === password) {
      loggedIn = true;
      res.send("logged in");
      console.log("Logged in");
      var easyrtcServer = easyrtc.listen(app, socketServer, {
        'apiEnable': 'true'
      });
    } else {
      res.send("Incorrect password.");
    }
  }
});

//Serve a static logout page
app.get('/logout', function (req, res) {
  if (loggedIn === true) {
    res.sendfile(__dirname + '/public/logout.html');
    console.log("logout page");

  } else {
    res.send("Not logged in.");
  }
});

//Check the password to prevent unauthoried logouts
app.post('/logout', function (req, res) {
  console.log("Posted data:" + JSON.stringify(req.body));
  if (req.body.pw === password) {
    if (loggedIn === true) {
      loggedIn = false;
      res.send("Logged out");
      console.log("logged out");

      //Consider killing all active sessions here
      easyrtc.setOption('apiEnable', 'false');
    } else {
      res.send("You were already logged out");
      console.log("Attempt to logout when not logged in");
    }
  } else {
    console.log("Bad password attempt");
    res.send("Incorrect password");
  }
});

//Initiate a video call
app.get('/video', function (req, res) {
  if (loggedIn === true) {
    res.sendfile(__dirname + '/views/multiparty.html');
  } else {
    res.send("Please try later.");
  }
});
var port = process.env.PORT || 8080;
// var webServer = app.listen(process.env.port || 8080); //for running localhost port
var webServer = app.listen(port);
console.log('Listening on port ' + port);

// Start Socket.io so it attaches itself to Express server
var socketServer = io.listen(webServer);
