var express = require('express');
var receiver = require('./receiver');

var app = express();

app.use(express.static(__dirname + '/public'));

app.set('port', (process.env.PORT || 5000));
// app.get('/', function(request, response) {
	// response.sendFile(__dirname + '/client/views/index.html');
// });

app.post('/receiver.html', function(request, response) {
    var body = '';
    request.on('data', function(data) {
        body += data;
    });
    request.on('end', function (){
		receiver.handle(body);
    });
});

app.post('/receive', function(request, respond) {
});

app.get('/data.html', function(request, response) {
	response.sendFile(__dirname + '/data.json');
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
