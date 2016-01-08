var URL = "http://10.0.1.24/api/4cca312bfd9d1976814b78d491ecd8b/lights/1/state";

        var dataObject = {"on":true, "hue": 44560};

        alert(JSON.stringify(dataObject));



        $.ajax({
        type: 'PUT',
        dataType: 'json',
        url: 'http://' + '10.0.1.24' +'/api/' +
            '4cca312bfd9d1976814b78d491ecd8b' + '/lights/' + '1' + '/state',
        data: JSON.stringify(dataObject),
        success: function(data) { },
        error: function(a, err) { }
    });