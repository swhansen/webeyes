//initial test experiment
// set to run as a grunt task but requires the server to be
// fited up seperatly
// zombie, mocha, chai

var Browser = require('zombie'),
    assert = require('chai').assert;

var browser;

describe('Entry-Page Tests', function () {

    setup(function () {
        browser = new Browser();
    });

    it('should show the entry page', function (done) {
        var page = 'http://localhost:8080';
        browser.visit(page, function () {
            assert(browser.text("#login-message") === "Start a New WEG2RT Session",
                "page heading must match");
            done();
        });
    });

    describe("when logging in", function () {
        var page = 'http://localhost:8080/';
        it("should accept a valid password", function (done) {
            browser.visit(page).then(function () {
                browser.fill("password", "weg2rt");
                return browser.pressButton("#entry-submit");
            }).then(function () {
                assert(browser.text('title') === "WEG2RT Room",
                       "main page");
               // assert.ok(browser.success, 'page loaded');

            }).then(done, done);
        });
    });
});