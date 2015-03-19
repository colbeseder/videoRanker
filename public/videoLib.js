var videoLib = (function () {
	function start(src, screenSelector, len, cb, cinema) {
		$("#cover").hide();
		cinema = cinema || {};
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
			var d = JSON.stringify(cinema.report);
			console.log(d);
			$.post("receiver", d);
			cinema.stop();
			if (typeof cb === "function"){
				cinema.cb();
			}
		}

		function playPause(btnSel, toPlay){
			var $btn = $(btnSel + ">span")
			var playIcon = "glyphicon-play";
			var pauseIcon = "glyphicon-pause";
			playing = !playing;
			if(typeof toPlay === "boolean"){
				playing = toPlay;
			}
			if(playing){
				$btn.removeClass(playIcon).addClass(pauseIcon);
			}
			else {
				$btn.removeClass(pauseIcon).addClass(playIcon);
			}
		}

		$(cinema.v).on("timeupdate", updateRating).on("ended", handleEndOfMovie);

		cinema.stop = stop;
		var playing = false;
		$(screenSelector + " #bNextVideo").on("click", function () {
			$(cinema.v).trigger("ended");
		});

		$(screenSelector + " #bBackToStart").on("click", function () {
			cinema.v.pause();
			playPause(screenSelector + " #bPlayPause", false);
			cinema.v.currentTime = 0;
		});
		$(screenSelector + " #bPlayPause").on("click", function () {
			if (playing) {
				cinema.v.pause();
				playPause(screenSelector + " #bPlayPause", false);
			} else {
				cinema.v.play();
				playPause(screenSelector + " #bPlayPause", true);
			}
		});
		function stop() {
			$(cinema.v).off("timeupdate", updateRating).off("ended", handleEndOfMovie);
			this.v.pause();
			playPause(screenSelector + " #bPlayPause", false);
			this.v.src = "";
			this.v.removeAttribute("src");
			cinema.cinema.querySelectorAll("#rating")[0].value = 50;
		}
		return cinema;
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

	function chain(list, screenSelector, len, startIndex, cinema){
		startIndex = startIndex || 0;
		return next(list, screenSelector, len, startIndex, cinema);
	}

	function next(list, screenSelector, len, idx, cinema){
		if(list[idx]){
			return videoLib.start(list[idx], screenSelector, len, function(){
				next(list, screenSelector, len, idx+1, cinema);
			});
		}
		else {
			$("#cover").show();
		}
	}

	window.user = readCookie("user");

	return {
		start : start,
		chain: chain
	}
})();
