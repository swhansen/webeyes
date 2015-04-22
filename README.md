# Web Eyes Got to Real Time (WEG2RT) #

* Prototype for initial version of a Collaborative Augmented Information Sharing System
* Version: 0.3.2

## Technologies

* node.js
* express - node  application framework (http://expressjs.com/)
* Handlebars - semantic templating (http://handlebarsjs.com/)
* webrtc.io - javascript (RTC) -  (https://github.com/webRTC/webRTC.io)
* socket.io
* WebRTC
* buildAR
* WebGL
* Jasmine - TDD framework
* HTML5 Canvas
* jQuery, jQuery-UI
* lo-dash - functional infrastructure
* mongodb and mongoose
* Bower
* Browserify

## Repository:

    https://bitbucket.org/sw_hansen/weg2rt

## Deploy:

[Heroku Dev Center](https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction)

[Mongo](https://www.mongolab.com) deployed using mongolab

## Testing

Grunt is used to tie the testing togather

* Mocha - Test Framework
* Chai - Assertion Library
* zombie

## Protocol, Best Practices, Style

Use the following guides for getting things done, programming well, and
programming in style.

* [Protocol](http://github.com/thoughtbot/guides/blob/master/protocol)
* [Best Practices](http://github.com/thoughtbot/guides/blob/master/best-practices)
* [Style](http://github.com/thoughtbot/guides/blob/master/style)
* [Javascript Style jQuery](https://contribute.jquery.org/style-guide/js/)
* Javascript style is checked with [jscs](http://jscs.info/) using the [jquery](https://contribute.jquery.org/style-guide/js/) syle syntax
* [jshint](http://jshint.com/about/)
* git [precommit-hook](https://www.npmjs.com/package/precommit-hook) is used.

### Contribution guidelines ###

* Writing tests
* Code review
* Other guidelines

### Who do I talk to? ###

Steve Hansen - sw_hansen@obliquevision.org


##Instructions on local setup for demo (node.js must be installed)

Run in your terminal

```bash
git clone https://sw_hansen@bitbucket.org/sw_hansen/weg2rt.git
```

```bash
cd weg2rt
```

```bash
npm install
```

```bash
node server.js
```

visit [localhost:8080/login](http://localhost:8080/login)

enter the password (email me)

click allow to see your camera

in a new tab go to [localhost:8080](http://localhost:8080)

click allow to see your camera and the connection will be made between your two open windows.



