var fs = require('fs');

module.exports = {
	handle : function (data) {
		fs.writeFile(__dirname + "/data.json", data, function (err) {
			if (err) {
				return console.log(err);
			}

			console.log("The file was saved!");
		});
	}
};
