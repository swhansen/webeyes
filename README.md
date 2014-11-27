# Web Eyes Got to Real Time (WEG2RT) #

* Prototype for initial version of an Collaborative Augmented Information Sharing System
* Version: 0.1

## Technologies

* node.js
* express - node  application framework (http://expressjs.com/)
* Handlebars - semantic templating (http://handlebarsjs.com/)
* webrtc.io - javascript (RTC) -  (https://github.com/webRTC/webRTC.io)
* WebGL -  web 3D graphics (http://get.webgl.org/, http://www.chromeexperiments.com/webgl/)
* socket.io
* EasyRTC
* buildAR
* Jasmine - TDD framework

## Repository:

    https://bitbucket.org/sw_hansen/weg2rt

## Deploy: 

[Heroku Dev Center](https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction)

## Testing

Grunt is used to tie the testing togather

* Mocha - Test Framework
* Chai - Assertion Library
* jshint - syntax
* zombie

## Protocol, Best Practices, Style

Use the following guides for getting things done, programming well, and
programming in style.

* [Protocol](http://github.com/thoughtbot/guides/blob/master/protocol)
* [Best Practices](http://github.com/thoughtbot/guides/blob/master/best-practices)
* [Style](http://github.com/thoughtbot/guides/blob/master/style)
* [Javascript Style Google](https://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml)

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



