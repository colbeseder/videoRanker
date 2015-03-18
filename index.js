var express = require('express');
var receiver = require('./receiver');

var app = express();

app.use(express.static(__dirname + '/public'));

app.set('port', (process.env.PORT || 5000));

var reportLog = [];

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
