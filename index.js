var express = require('express');
var pg = require('pg');

var app = express();

app.use(express.static(__dirname + '/public'));

app.set('port', (process.env.PORT || 5000));

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
	});
});

app.get('/movies', function (request, response) {
	var movieList = fs.readdirSync("/public/movies");
	response.send(movieList);
};

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
