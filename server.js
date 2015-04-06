var bodyParser = require('body-parser');
var express    = require('express');
var app        = express();
var io         = require("socket.io");
var easyrtc    = require("easyrtc");
var clients    = [];
var linecolors = ["rgba(255, 0, 0, 1)", "rgba(255, 0, 225, 1)", "rgba(255, 115, 0, 1)", "rgba(0, 0, 225, 1)"];

app.use('/js', express.static(__dirname + '/easyrtc/js'));

app.use(express.static(__dirname + '/public'));

app.use('/images', express.static(__dirname + '/easyrtc/images'));
app.use('/css', express.static(__dirname + '/easyrtc/css'));

app.use('/css', express.static(__dirname + '/public/css'));
app.use('/img', express.static(__dirname + '/public/img'));
app.use('/javascript', express.static(__dirname + '/public/javascripts'));
app.use('/bower', express.static(__dirname + '/bower_components'));


//app.use('/bower', express.static(__dirname + '/bower_components'));

// Needed to parse form data(changed for express 4.x)
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());


var loggedIn = false;
var password = 'weg2rt';

var handlebars = require('express-handlebars')
  .create({
    defaultLayout: 'main'
  });

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// test for tests....
app.use(function (req, res, next) {
  res.locals.showTests = app.get('env') !== 'production' &&
    req.query.test === '1';
  next();
});

////Test home page
//app.get('/', function   (req, res) {
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

//  Main entry point

app.get('/', function (req, res) {
  console.log('Login attempt');
  if (loggedIn === true) {
    res.sendFile(__dirname + '/views/multiparty.html');
  } else {
    res.render('entry', {
      pageTestScript: '/qa/tests-entry.js'
    });
  }
});

//Respond to POST from login form
app.post('/', function (req, res) {
  if (loggedIn === true) {
    res.send("Already logged in.");
  } else {
    console.log("Posted data:" + JSON.stringify(req.body) );
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


//app.get('/geo', function (req, res) {
// if (loggedIn === true) {
//   res.sendfile(__dirname + '/views/geo-ar.html');
// } else {
//   res.send("Please try later.");
// }
//);

app.get('/about', function (req, res) {
   res.sendFile(__dirname + '/views/about.handlebars');
});



// set port to 80 for heroku ???
var port = process.env.PORT || 8080;
// var webServer = app.listen(process.env.port || 8080); //for running localhost port
var webServer = app.listen(port);
//console.log('Listening on port ' + port);

// Start Socket.io so it attaches itself to Express server
var socketServer = io.listen(webServer);

// Collabortive  drawing stuff
socketServer.sockets.on('connection', function (client) {

  client.on('utility', function (data, session) {
    client.emit('utility', data);
    client.broadcast.emit('utility', data);
  })

  client.on('drawLine', function (data, session) {
    // build up the colors for  drawing
    if (!(client.id in clients)) {
      clients[client.id] = linecolors[Object.keys(clients).length];
    }
    data.color = clients[client.id];
    data.client = client.id;
    client.emit('drawLine', data);
    client.broadcast.emit('drawLine', data);
  });
});