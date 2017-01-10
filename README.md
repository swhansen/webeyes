# Web Eyes Go To Real-Time (WEG2RT) #

* Prototype for initial version of a Collaborative Augmented Information Sharing System
* Version: 0.4.0

## Technologies

* node.js
* express - node application framework (http://expressjs.com/)
* Handlebars - semantic templating (http://handlebarsjs.com/)
* socket.io
* WebRTC
* WebGL - three.js
* Jasmine - TDD framework
* HTML5 Canvas
* jQuery, jQuery-UI
* lo-dash - functional infrastructure
* mongodb and mongoose
* Bower
* Browserify

## Repository:

    https://github.com/swhansen/webeyes

    https://github.com/swhansen/webeyes-api

## Deploy:

[Heroku Dev Center](https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction)

[Mongo](https://www.mongolab.com) deployed using mongolab

## API

We use [Swagger](http://swagger.io/) to develop, maintain and present our APIs

https://app.swaggerhub.com/api/swhansen/WEG2RT/1.0.0

## Testing

Grunt is used to tie the testing togather

* Mocha - Test Framework
* Chai - Assertion Library
* zombie

## Continuous Deployment

* CodeShip is used as the CI pipeline
* Build pushes to Github-origin trigger CodeShip
* Successful builds are pushed to Heroku

## Protocol, Best Practices, Style

Use the following guides for getting things done, programming well, and
programming in style.

* [Protocol](http://github.com/thoughtbot/guides/blob/master/protocol)
* [Best Practices](http://github.com/thoughtbot/guides/blob/master/best-practices)
* [Thoughtbot Style](http://github.com/thoughtbot/guides/blob/master/style)
* [Airbnb Style Guide](https://github.com/airbnb/javascript)
* Javascript style is checked with [jscs](http://jscs.info/) using the [airbnb](https://github.com/airbnb/javascript/blob/master/linters/SublimeLinter/SublimeLinter.sublime-settings) syle syntax
* [jshint](http://jshint.com/about/)
* git [precommit-hook](https://www.npmjs.com/package/precommit-hook) is used.

### Contribution guidelines ###

* Writing tests
* Code review
* Other guidelines

### Who do I talk to? ###

Steve Hansen - sw_hansen@obliquevision.org


##Instructions on local setup for demo (node.js v0.10.29 or greater must be installed)

Run in your terminal

```bash
git clone https://github.com/swhansen/webeyes.git
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

visit [localhost:5000](http://localhost:5000) in Chrome, Firefox or Opera





