var videoLib = (function () {
	function start(src, screenSelector, len, cb) {
		var cinema = {};
		screenSelector = screenSelector || "#cinema";
		cinema.cinema = document.querySelectorAll(screenSelector)[0];
		cinema.v = cinema.cinema.querySelectorAll("#mainScreen")[0];
		cinema.v.src = src;
		cinema.videoLength = len || 60; //s
		cinema.cb = cb;
		cinema.getRating = function () {
			var el = cinema.cinema.querySelectorAll("#rating")[0];
			return parseInt(el.value, 10);
		}
		cinema.report = {
			video : cinema.v.src,
			username : readCookie("user"),
			guid : Math.random().toString().slice(2),
			score: []
		};
		for (var i = 0; i < cinema.videoLength; ++i) {
			cinema.report.score[i] = "";
		}

		function updateRating(){
			var t = this.currentTime;
			cinema.report.score[Math.floor(t)] = cinema.getRating();
		}
		
		function handleEndOfMovie(){
			$(cinema.v).off("timeupdate", updateRating).off("ended", handleEndOfMovie);
			var d = JSON.stringify(cinema.report);
			console.log(d);
			$.post("receiver", d);
			cinema.stop();
			if (typeof cb === "function"){
				cinema.cb();
			}
		}
		
		$(cinema.v).on("timeupdate", updateRating).on("ended", handleEndOfMovie);
		
		cinema.stop = stop;
		var playing = false;
		$(screenSelector + " #bPlayPause").on("click", function () {
			if (playing) {
				cinema.v.pause();
				this.innerHTML = "play";
				playing = false;
			} else {
				cinema.v.play();
				this.innerHTML = "pause";
				playing = true;
			}
		});
		function stop() {
			this.v.pause();
			$(screenSelector + " #bPlayPause").html("play");
			playing = false;
			this.v.src = "";
			this.v.removeAttribute("src");
			cinema.cinema.querySelectorAll("#rating")[0].value = 50;
		}
	}

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

	function chain(list, screenSelector, len){
		next(list, screenSelector, len, 0);
	}
	
	function next(list, screenSelector, len, idx){
		if(list[idx]){
			videoLib.start(list[idx], screenSelector, len, function(){
				next(list, screenSelector, len, idx+1);
			});
		}
	}
	
	return {
		start : start,
		chain: chain
	}
})();
