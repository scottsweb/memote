chrome.runtime.onInstalled.addListener(function () {
	let settings = {
		hotkeys: {
			codes: {
				navUp: [['w'], ['arrowup']],
				navLeft: [['a'], ['arrowleft']],
				navDown: [['s'], ['arrowdown']],
				navRight: [['d'], ['arrowright']],
				jump: [['j'], ['i']],
				quit: [['q']],
				click: [['f'], ['enter']],
				shiftClick: [
					['shift', 'enter'],
					['shift', 'f']
				],
				controlClick: [
					['control', 'enter'],
					['control', 'f']
				],
				disableKeys: [['control', 'shift', 'x']]
			}
		}
	};

	chrome.storage.local.set({ 'extension-settings': settings }, function () {
		console.log('Initial setting set...');
	});
});
