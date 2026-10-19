(function () {
	'use strict';

	function waitForPlayer() {
		var n = 0;
		(function check() {
			var btn = document.querySelector('button[aria-label="Fullskärm"]');
			if (btn) {
				btn.click();
				return;
			}
			if (++n < 60) setTimeout(check, 200);
		})();
	}

	function waitForModal() {
		var n = 0;
		(function check() {
			var btn = document.querySelector(
				'div[data-rt="modal"] a[href^="/video/"]'
			);
			if (btn) {
				document.querySelectorAll('.spatialnavigation-cursor').forEach(
					function (el) { el.classList.remove('spatialnavigation-cursor'); }
				);
				btn.classList.add('spatialnavigation-cursor');
				btn.focus();
				return;
			}
			if (++n < 60) setTimeout(check, 200);
		})();
	}

	document.addEventListener('click', function (e) {
		if (e.target.closest('a[href^="/video/"]')) setTimeout(waitForPlayer, 300);

		if (e.target.closest('a[data-rt="list-item"]')) {
			waitForModal();
		}
	});
})();
