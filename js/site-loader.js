(function () {
	'use strict';

	var siteConfig = null;

	// Load site configuration
	function loadSiteConfig() {
		fetch(chrome.runtime.getURL('sites.json'))
			.then(function (response) {
				return response.json();
			})
			.then(function (data) {
				siteConfig = data;
				applySiteConfig();
			})
			.catch(function (err) {
				console.warn('[Memote] Failed to load site config:', err);
			});
	}

	// Get current site config based on domain
	function getCurrentSiteConfig() {
		var hostname = window.location.hostname;

		if (siteConfig && siteConfig.sites) {
			for (var i = 0; i < siteConfig.sites.length; i++) {
				var site = siteConfig.sites[i];
				if (hostname.includes(site.domain)) {
					return site;
				}
			}
		}
		return null;
	}

	// Apply site-specific styles
	function applySiteConfig() {
		var site = getCurrentSiteConfig();

		if (!site) {
			return;
		}

		console.log('[Memote] Config found for:', site.name);

		// Inject site-specific CSS
		if (site.cssFile !== false) {
			var link = document.createElement('link');
			link.rel = 'stylesheet';
			link.type = 'text/css';
			link.href = chrome.runtime.getURL(site.cssFile);
			document.head.appendChild(link);
			console.log('[Memote] Loaded CSS:', site.cssFile);
		}

		// Inject site-specific JS
		if (site.jsFile !== false) {
			var script = document.createElement('script');
			script.src = chrome.runtime.getURL(site.jsFile);
			script.async = false;
			document.head.appendChild(script);
			console.log('[Memote] Loaded JS:', site.jsFile);
		}

		// Update cursor color based on site color
		updateCursorColor(site.color);

		// Apply initial focus after a short delay
		applyInitialFocus(site.initialFocus);
	}

	// Focus on initial selector
	function applyInitialFocus(selector) {
		if (!selector) {
			return;
		}
		var attempts = 0;
		var maxAttempts = 10;
		var focusTarget = null;
		function tryFocus() {
			attempts++;
			var elements = document.querySelectorAll(selector);
			if (elements.length > 0) {
				var target = elements[0];
				if (focusTarget !== target) {
					if (focusTarget) {
						focusTarget.classList.remove('spatialnavigation-cursor');
					}
					target.classList.add('spatialnavigation-cursor');
					focusTarget = target;
					console.log(
						'[Memote] Focus applied to:',
						target.tagName,
						target.textContent.trim().substring(0, 50)
					);
				}
				return;
			}
			if (attempts < maxAttempts) {
				setTimeout(tryFocus, 500);
			}
		}
		tryFocus();

		var observer = new MutationObserver(function (mutations) {
			for (var i = 0; i < mutations.length; i++) {
				var removed = mutations[i].removedNodes;
				for (var j = 0; j < removed.length; j++) {
					if (
						focusTarget &&
						(removed[j] === focusTarget || removed[j].contains(focusTarget))
					) {
						focusTarget = null;
						tryFocus();
						return;
					}
				}
			}
		});
		observer.observe(document.body, { childList: true, subtree: true });
	}

	// Update cursor highlight color using CSS custom property
	function updateCursorColor(color) {
		if (color) {
			document.documentElement.style.setProperty(
				'--memote-cursor-color',
				color
			);
			document.documentElement.style.setProperty(
				'--memote-cursor-bg',
				color + '20'
			);
			document.documentElement.style.setProperty('--memote-marker-bg', color);
		}
	}

	// Export for use in other modules
	window.MEMOTE_SITE = {
		loadSiteConfig: loadSiteConfig,
		getCurrentSiteConfig: getCurrentSiteConfig,
		applySiteConfig: applySiteConfig,
		getHomeUrl: function () {
			var site = getCurrentSiteConfig();
			return site && site.url ? site.url : null;
		}
	};

	// Initialize on load
	loadSiteConfig();
})();

