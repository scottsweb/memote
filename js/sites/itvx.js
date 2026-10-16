(function () {
	'use strict';

	function waitForPlayer() {
		var n = 0;
		(function check() {
			var btn = document.querySelector('button[data-testid="fullscreen"]');
			if (btn) {
				btn.click();
				return;
			}
			if (++n < 60) setTimeout(check, 200);
		})();
	}

	document.addEventListener('click', function (e) {
		if (e.target.closest('.cp_button--primary.videoPlayer__play-btn'))
			setTimeout(waitForPlayer, 300);
	});
})();
