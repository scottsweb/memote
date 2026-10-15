// ============================================================================
// BBC iPlayer - Site-specific hacks
// ============================================================================
// Handles iPlayer-specific navigation issues

(function () {
	'use strict';

	// iPlayer video player doesn't focus properly with Enter
	// This hack ensures the video controls are focusable
	function init() {
		console.log('[Memote/iPlayer] Initializing site hacks');

		// Watch for video elements and add tabindex if needed
		var observer = new MutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {
				mutation.addedNodes.forEach(function (node) {
					if (node.nodeType === 1) {
						var videos = node.querySelectorAll ? node.querySelectorAll('video') : [];
						videos.forEach(function (video) {
							if (!video.hasAttribute('tabindex')) {
								video.setAttribute('tabindex', '0');
							}
						});
					}
				});
			});
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true
		});
	}

	// Run when DOM is ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
