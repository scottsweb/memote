(function () {
	'use strict';

	function enterFullscreen(el) {
		try {
			if (el.requestFullscreen) el.requestFullscreen();
		} catch (e) {}
	}

	function waitForPlayer() {
		var n = 0;
		(function check() {
			var el = document.querySelector('.videoPlayerWrapper.visible');
			if (el) { enterFullscreen(el); return; }
			if (++n < 60) setTimeout(check, 200);
		})();
	}

	document.addEventListener('click', function (e) {
		if (e.target.closest('button.cp_button--primary')) setTimeout(waitForPlayer, 300);
	});
})();
