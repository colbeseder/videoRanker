var express = require('express');
var receiver = require('./receiver');

var app = express();

app.use(express.static(__dirname + '/public'));

app.set('port', (process.env.PORT || 5000));

var demoData = ["{\"0\":50,\"1\":39,\"2\":39,\"3\":39,\"4\":71,\"5\":71,\"6\":71,\"7\":71,\"8\":85,\"9\":85,\"10\":16,\"11\":16,\"12\":23,\"13\":23,\"14\":23,\"video\":\"https://dry-ocean-7339.herokuapp.com/1.MOV\",\"username\":\"Bryan\",\"guid\":\"7001625357661396\"}","{\"0\":7,\"1\":7,\"2\":12,\"3\":12,\"4\":21,\"5\":21,\"6\":21,\"7\":30,\"8\":23,\"9\":23,\"10\":23,\"11\":23,\"12\":37,\"13\":37,\"14\":37,\"video\":\"https://dry-ocean-7339.herokuapp.com/1.MOV\",\"username\":\"Bryan\",\"guid\":\"516686491901055\"}","{\"0\":0,\"1\":0,\"2\":0,\"3\":0,\"4\":0,\"5\":0,\"6\":100,\"7\":100,\"8\":100,\"9\":100,\"10\":100,\"11\":100,\"12\":100,\"13\":100,\"14\":100,\"video\":\"https://dry-ocean-7339.herokuapp.com/1.MOV\",\"username\":\"Bryan\",\"guid\":\"22148653236217797\"}","{\"0\":38,\"1\":38,\"2\":38,\"3\":38,\"4\":38,\"5\":38,\"6\":38,\"7\":38,\"8\":38,\"9\":38,\"10\":38,\"11\":38,\"12\":38,\"13\":38,\"14\":38,\"video\":\"https://dry-ocean-7339.herokuapp.com/1.MOV\",\"username\":\"Someone_else\",\"guid\":\"8902087050955743\"}"];

var reportLog = demoData || [];

app.post('/receiver', function(request, response) {
    var body = '';
    request.on('data', function(data) {
        body += data;
    });
    request.on('end', function (){
		reportLog.push(body);
		// receiver.handle(body);
    });
});

app.get('/data', function(request, response) {
	response.send(JSON.stringify(reportLog));
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
