var Browser = require('zombie'),
    assert = require('chai').assert;

var browser;

suite('Entry-Page Tests', function() {

    setup(function() {
        browser = new Browser();
    });

    test('should show the entry page', function(done) {
        var page = 'http://localhost:8080';
        browser.visit(page, function() {
            assert(browser.text("#login-message") === "Start a new WEG2RT Session",
                "page heading must match");
            done();
        });
    });

    describe("when logging in", function() {
        var page = 'http://localhost:8080/';
        it("should initiate a session page", function(done) {
            browser.visit(page).then(function() {
                browser.fill("password", "weg2rt");
                return browser.pressButton("#entry-submit");
            }).then(function() {
                browser.assert.text('title', 'WEG2RT Room');

            }).then(done, done);
        });
    });

});