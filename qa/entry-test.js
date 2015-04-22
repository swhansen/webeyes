
//initial test experiment
// set to run as a grunt task but requires the server to be
// fited up seperatly
// zombie, mocha, chai

var Browser = require('zombie'),
    assert = require('chai').assert;

var browser;

suite('Entry-Page Tests', function () {

    setup(function () {
        browser = new Browser();
    });

    test('should show the entry page', function (done) {
        var page = 'http://localhost:5000';
        browser.visit(page, function () {
            assert(browser.text("#login-message") === "Start a New WEG2RT Session",
                "page heading must match");
            done();
        });
    });

    describe("when logging in", function () {
        var page = 'http://localhost:5000/';
        it("should initiate a session page", function (done) {
            browser.visit(page).then(function () {
                browser.fill("password", "weg2rt");
                return browser.pressButton("#entry-submit");
            }).then(function () {
                //browser.assert.text('title', 'WEG2RT Room');
                assert.ok(browser.success, 'page loaded');

            }).then(done, done);
        });
    });
});
