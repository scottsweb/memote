(function () {
	'use strict';

	function enterFullscreen(el) {
		try {
			if (el.requestFullscreen) el.requestFullscreen();
			else if (el.parentElement && el.parentElement.requestFullscreen) el.parentElement.requestFullscreen();
		} catch (e) {}
	}

	function waitForFullscreen() {
		var n = 0;
		(function check() {
			var el = document.querySelector('smp-toucan-player');
			if (el && el.parentElement) { enterFullscreen(el); return; }
			if (++n < 60) setTimeout(check, 200);
		})();
	}

	document.addEventListener('click', function (e) {
		if (e.target.closest('button.play-cta__inner')) setTimeout(waitForFullscreen, 500);
	});
})();
