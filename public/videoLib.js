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
window.user = readCookie("user");

var app = angular.module('ngScreen', []);

app.controller('screenCtrl', function ($scope, $http) {
	function Cinema(selCinema) {
		if (this === window) {
			throw "Cinema not used as constructor"
		}
		var that = this;
		window.BA = this;
		this.$cinema = $(selCinema).eq(0);
		this.$screen = this.$cinema.children("#mainScreen").eq(0);
		this.screen = this.$screen.get(0);
		this.$btns = this.$cinema.find("button");
		this.$rating = this.$cinema.find("#rating").eq(0);
		// TODO:
		this.videoLength = MAX_LENGTH;
		this.getRating = function () {
			console.log(parseInt(that.$rating.val(), 10));
			return parseInt(that.$rating.val(), 10);
		}

		flushReport = function () {
			that.report = {
				video : that.screen.src,
				username : readCookie("user"),
				guid : Math.random().toString().slice(2),
				score : []
			};
		}

		flushReport();

		for (var i = 0; i < cinema.videoLength; ++i) {
			this.report.score[i] = "";
		}

		this.updateRating = function () {
			var t = that.screen.currentTime;
			that.report.score[Math.floor(t)] = that.getRating();
		}

		this.handleEndOfMovie = function () {
			that.report.video = $scope.current;
			var d = JSON.stringify(that.report);
			console.log(d);
			if (/localhost/.test(location.host)) {
				console.log("Not sending reports");
			} else {
				$.post("receiver", d);
			}
			that.stop();
			changeVideo($scope.currentIdx + 1);
		}

		this.playPause = function (toPlay) {
			var $btn = this.$btns.eq(1);
			var $span = $btn.children("span");
			var playIcon = "glyphicon-play";
			var pauseIcon = "glyphicon-pause";
			this.isPlaying = !this.isPlaying;
			if (typeof toPlay === "boolean") {
				this.isPlaying = toPlay;
			}
			if (this.isPlaying) {
				$span.removeClass(playIcon).addClass(pauseIcon);
				this.screen.play();
			} else {
				$span.removeClass(pauseIcon).addClass(playIcon);
				this.screen.pause();
			}
		}

		$(this.screen).on("timeupdate", this.updateRating).on("ended", this.handleEndOfMovie);

		this.stop = function () {
			that.playPause(false);
			that.$rating.val(50);
		}

		this.isPlaying = false;
		this.$btns.eq(2).on("click", function () {
			that.$screen.trigger("ended");
		});

		this.$btns.eq(0).on("click", function () {
			that.screen.pause();
			that.playPause(false);
			that.screen.currentTime = 0;
		});

		this.$btns.eq(1).on("click", function () {
			if (that.isPlaying) {
				that.screen.pause();
				that.playPause(false);
			} else {
				that.screen.play();
				that.playPause(that);
				$("#cover").hide();
			}
		});

	}

	var CINEMA = new Cinema("#cinema");
	$scope.currentIdx = 0;
	$scope.rating = 50;

	function changeVideo(idx) {
		if (idx !== undefined) {
			$scope.currentIdx = idx;
		}
		if ($scope.currentIdx < $scope.VIDEOS.length){
			$scope.current = "movies/" + $scope.VIDEOS[$scope.currentIdx];
		}
		else {
			$("#cover").show();
		}
		try {
			$scope.$digest();
		} catch (err) {
			//Digest not ready
		}
	}

	$('#videoNav').on('click', "li", function (ev) {
		var newIdx = $('#videoNav li').index(this);
		if (newIdx !== $scope.currentIdx) {
			CINEMA.stop();
			changeVideo(newIdx);
		}
	});
	$http.get('movies.json').then(function (res) {
		$scope.VIDEOS = res.data;
		window.VIDEOS = $scope.VIDEOS;
		changeVideo(0);
	});

	/* Custom GUI code: slider */
	$('#rating').on('input', function () {
		scaleChange(0);
	});
	function scaleChange(x) {
		var c = parseInt($('#rating').val(), 10);
		var n = c + x;
		$scope.rating = n;
		$scope.$digest();
	}
	function scaleInc() {
		scaleChange(1);
	}
	function scaleDec() {
		scaleChange(-1);
	}

	// Arrow keys
	$(document).keydown(function (e) {
		switch (e.which) {
		case 37: // left
		case 40: // down
			scaleDec();
			break;

		case 38: // up
		case 39: // right
			scaleInc();
			break;
		default:
			return; // exit this handler for other keys
		}
		e.preventDefault(); // prevent the default action (scroll / move caret)
	});

});
