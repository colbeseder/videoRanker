var express = require('express');
var receiver = require('./receiver');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

// app.get('/', function(request, response) {
	// response.sendFile(__dirname + '/client/views/index.html');
// });

app.get('receiver.html', function(request, response) {
	receiver.handle("---DATA---");
	response.send("ok");
});


app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
