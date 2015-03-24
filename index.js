var express = require('express');
var pg = require('pg');
var receiver = require('./receiver');
var crud = require('./crud');

var app = express();

app.use(express.static(__dirname + '/public'));

app.set('port', (process.env.PORT || 5000));

var demoData = ["{\"video\":\"https://dry-ocean-7339.herokuapp.com/movies/1.MOV\",\"username\":\"Bryan\",\"guid\":\"3772910893894732\",\"score\":[50,50,61,61,61,54,24,24,24,24,24,24,24,24,24,\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\"]}", "{\"video\":\"https://dry-ocean-7339.herokuapp.com/movies/2.MOV\",\"username\":\"Bryan\",\"guid\":\"5250182980671525\",\"score\":[66,66,66,79,79,79,79,79,79,79,79,79,10,10,10,10,10,10,10,10,10,10,10,10,10,10]}", "{\"video\":\"https://dry-ocean-7339.herokuapp.com/movies/1.MOV\",\"username\":\"Eitan\",\"guid\":\"909584557171911\",\"score\":[50,50,100,100,100,100,100,100,100,100,80,80,80,60,34,\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\"]}", "{\"video\":\"https://dry-ocean-7339.herokuapp.com/movies/2.MOV\",\"username\":\"Eitan\",\"guid\":\"6839111733715981\",\"score\":[30,30,30,29,28,28,26,26,26,23,23,0,0,50,0,100,89,20,55,17,21,55,68,46,45,46]}", "{\"video\":\"https://dry-ocean-7339.herokuapp.com/movies/1.MOV\",\"username\":\"Naomi\",\"guid\":\"9916634941473603\",\"score\":[50,50,50,50,50,50,50,50,50,50,50,50,50,50,89,\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\"]}", "{\"video\":\"https://dry-ocean-7339.herokuapp.com/movies/2.MOV\",\"username\":\"Naomi\",\"guid\":\"6385488107334822\",\"score\":[50,50,50,50,50,50,50,50,50,50,50,50,50,100,100,100,100,100,100,100,100,100,100,100,100,100]}"];

var reportLog = demoData || [];

function empty() {}

function pgQuery(query, cb, vals) {
	cb = cb || empty;
	vals = vals || [];

};

app.post('/receiver', function (request, response) {
	var body = '';
	request.on('data', function (data) {
		body += data;
	});
	request.on('end', function () {
		var data = JSON.parse(body);
		function cb(a, b){
			response.send(a || b);
		}
		pg.connect(process.env.DATABASE_URL, function (err, client, done) {
			client.query("INSERT INTO results VALUES ($1, $2, $3, $4)",
				[data.guid, data.username, data.video, JSON.stringify(data.score)],
				function (err, result) {
				done();
				if (err) {
					cb(err, null);
				} else {
					cb(null, result.rows);
				}
			});
		});
		reportLog.push(body);
	});
});

// app.get('/data', function (request, response) {
	// response.send(JSON.stringify(reportLog));
// });

app.get('/data', function (request, response) {
	pg.connect(process.env.DATABASE_URL, function (err, client, done) {
		client.query('TABLE results;', function (err, result) {
			done();
			if (err) {
				console.error(err);
				response.send("Error " + err);
			} else {
				response.send(result.rows);
			}
		});
	});
})
app.listen(app.get('port'), function () {
	console.log("Node app is running at localhost:" + app.get('port'));
});
