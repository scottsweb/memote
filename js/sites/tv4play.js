(function () {
	'use strict';

	function enterFullscreen() {
		try {
			if (document.documentElement.requestFullscreen) {
				document.documentElement.requestFullscreen();
			}
		} catch (e) {}
	}

	function waitForFullscreen() {
		var n = 0;
		(function check() {
			var btn = document.querySelector(
				'button[aria-label="Öppna helskärmsläge"]'
			);
			if (btn) {
				enterFullscreen();
				return;
			}
			if (++n < 60) setTimeout(check, 200);
		})();
	}

	document.addEventListener('click', function (e) {
		if (e.target.closest('a[class*="hero-cta-button"]'))
			setTimeout(waitForFullscreen, 300);
	});
})();
