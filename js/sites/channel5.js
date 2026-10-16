(function () {
	'use strict';

	function enterFullscreen(el) {
		try { el.requestFullscreen(); } catch (e) {}
	}

	function waitForPlayer() {
		var n = 0;
		(function check() {
			var el = document.querySelector('.c5-player');
			if (el) { enterFullscreen(el); return; }
			if (++n < 60) setTimeout(check, 200);
		})();
	}

	document.addEventListener('click', function (e) {
		var btn = e.target.closest('button[class*="primary"][class*="PlayerView"]');
		if (btn) setTimeout(waitForPlayer, 300);
	});
})();
