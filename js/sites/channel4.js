(function () {
	'use strict';

	function waitForPlayer() {
		var n = 0;
		(function check() {
			var btn = document.querySelector('.controls-container__control-button--fullscreen');
			if (btn) { btn.click(); return; }
			if (++n < 60) setTimeout(check, 200);
		})();
	}

	document.addEventListener('click', function (e) {
		if (e.target.closest('.text-button.play')) setTimeout(waitForPlayer, 300);
	});
})();
