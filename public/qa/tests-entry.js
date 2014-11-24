suite('"entry" Page Tests', function(){
    test('page should contain greeting text', function(){
      assert($('<p>You are about to initiate a WEG2RT Session</p>').length);
    });
    test('page should contain password input field', function(){
      assert($('<input type="password" />').length);
    });
    test('page should contain submit button', function(){
      assert($('<input type="submit" value="Go Collaborate" id="submit" />"]').length);
    });


    
});