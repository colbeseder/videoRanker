var v = document.getElementById("mainScreen");

function getRating() {
	var el = document.getElementById("rating");
	return parseInt(el.value, 10);
}

var report = {};

$(v).on("timeupdate", function () {
	var t = this.currentTime;
	report[Math.floor(t)] = getRating();
});

$(v).on("ended", function () {
	report.username = readCookie("user");
	report.video = this.src;
	$.post("receiver.html", report);
});

var playing = false;
$("#bPlayPause").on("click", function(){
	if(playing){
		v.pause();
		this.innerHTML = "play";
		playing = false;
	}
	else{
		v.play();
		this.innerHTML = "pause";
		playing = true;
	}
});

$("#bPause").on("click", function(){
	v.pause();
});

function createCookie(name, value, days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		var expires = "; expires=" + date.toGMTString();
	} else
		var expires = "";
	document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ')
			c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0)
			return c.substring(nameEQ.length, c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name, "", -1);
}