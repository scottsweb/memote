chrome.runtime.onInstalled.addListener(function () {
	chrome.storage.local.get(['extension-settings'], function (result) {
		if (!result['extension-settings']) {
			chrome.storage.local.set(
				{
					'extension-settings': {
						hotkeys: {
							codes: {
								navUp: [['w'], ['arrowup']],
								navLeft: [['a'], ['arrowleft']],
								navDown: [['s'], ['arrowdown']],
								navRight: [['d'], ['arrowright']],
								jump: [['j'], ['i']],
								click: [['f'], ['enter']],
								disableKeys: [['control', 'shift', 'x']]
							}
						}
					}
				},
				function () {
					console.log('Initial setting set...');
				}
			);
		}
	});
});

