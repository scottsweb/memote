/**
 * Based on spatial-navigation by falsandtru
 * ---
 * @author falsandtru https://github.com/falsandtru/spatial-navigation
 * @copyright 2015, falsandtru
 * @license MIT
 */
!new (function (NAME, VERSION) {
	'use strict';
	(function e(t, n, r) {
		function s(o, u) {
			if (!n[o]) {
				if (!t[o]) {
					var a = typeof require == 'function' && require;
					if (!u && a) return a(o, !0);
					if (i) return i(o, !0);
					var f = new Error("Cannot find module '" + o + "'");
					throw ((f.code = 'MODULE_NOT_FOUND'), f);
				}
				var l = (n[o] = { exports: {} });
				t[o][0].call(
					l.exports,
					function (e) {
						var n = t[o][1][e];
						return s(n ? n : e);
					},
					l,
					l.exports,
					e,
					t,
					n,
					r
				);
			}
			return n[o].exports;
		}
		var i = typeof require == 'function' && require;
		for (var o = 0; o < r.length; o++) s(r[o]);
		return s;
	})(
		{
			13: [
				function (require, module, exports) {
					'use strict';
					var KEYS_DOWN = new Set();
					var HOTKEY_CODES = {};
					var DEFAULT_HOTKEY_CODES = {
						home: [['escape']],
						navUp: [['w'], ['arrowup']],
						navLeft: [['a'], ['arrowleft']],
						navDown: [['s'], ['arrowdown']],
						navRight: [['d'], ['arrowright']],
						jump: [['j'], ['i']],
						click: [['f'], ['enter']],
						disableKeys: [['control', 'shift', 'x']]
					};

					function getSettings(callback) {
						chrome.storage.local.get(['extension-settings'], function (result) {
							try {
								var settingsFull = result && result['extension-settings'];
								if (
									!settingsFull ||
									!settingsFull.hotkeys ||
									!settingsFull.hotkeys.codes
								) {
									HOTKEY_CODES = DEFAULT_HOTKEY_CODES;
								} else {
									HOTKEY_CODES = settingsFull.hotkeys.codes;

									// Migrate: remove deprecated shiftClick and controlClick from stored settings
									if (
										'shiftClick' in HOTKEY_CODES ||
										'controlClick' in HOTKEY_CODES
									) {
										delete HOTKEY_CODES.shiftClick;
										delete HOTKEY_CODES.controlClick;
										chrome.storage.local.set({
											'extension-settings': settingsFull
										});
									}
								}
								window.__MEMOTE_HOTKEY_CODES = HOTKEY_CODES;

								if (callback instanceof Function) {
									callback();
								}
							} catch (e) {
								HOTKEY_CODES = DEFAULT_HOTKEY_CODES;
								window.__MEMOTE_HOTKEY_CODES = HOTKEY_CODES;
							}
						});
					}
					exports.getSettings = getSettings;

					function getHotkeyCodes() {
						return HOTKEY_CODES;
					}
					exports.getHotkeyCodes = getHotkeyCodes;

					function isHotkeyPressed(hotkeyID) {
						var codes = HOTKEY_CODES[hotkeyID];
						if (!codes) return false;
						return codes.some((combo) => {
							return setArrayMatch(KEYS_DOWN, combo);
						});
					}
					exports.isHotkeyPressed = isHotkeyPressed;

					// Functions for handling keys down
					// ------------------------------------------
					function startListeners() {
						window.addEventListener('keyup', removeFromKeysDown);

						window.addEventListener('blur', () => {
							KEYS_DOWN.clear();
						});
					}
					exports.startListeners = startListeners;

					function removeFromKeysDown(e) {
						if (e.key) KEYS_DOWN.delete(e.key.toLowerCase());
					}

					function addToKeysDown(e) {
						if (e.metaKey) KEYS_DOWN.add('meta');
						if (e.ctrlKey) KEYS_DOWN.add('control');
						if (e.altKey) KEYS_DOWN.add('alt');
						if (e.shiftKey) KEYS_DOWN.add('shift');
						if (e.key) KEYS_DOWN.add(e.key.toLowerCase());
					}
					exports.addToKeysDown = addToKeysDown;

					// checking equality of set values to array values, not case sensitive
					function setArrayMatch(set1, array1) {
						if (set1.size !== array1.length) return false;
						var sortedSet = Array.from(set1)
							.map(function (s) {
								return s.toLowerCase();
							})
							.sort();
						var sortedArray = array1
							.map(function (a) {
								return a.toLowerCase();
							})
							.sort();
						for (var i = 0; i < sortedSet.length; i++) {
							if (sortedSet[i] !== sortedArray[i]) return false;
						}
						return true;
					}
				},
				{}
			],
			2: [
				function (require, module, exports) {
					'use strict';
					var HELPER_FUNCTIONS = require('helperFunctions');

					exports.CURSOR_ID = 'spatialnavigation-cursor';
					exports.MARKER_TAG = 'spatialnavigation-marker';
					function attribute(event, cursor) {
						return {
							command: key2command(event),
							cursor: cursor
						};
					}
					exports.attribute = attribute;

					function key2command(event) {
						HELPER_FUNCTIONS.addToKeysDown(event);

						// check if the keys should be enabled or disabled
						let isSpatialNavEnabled = localStorage.getItem('isEnabled');
						// make value boolean, localStorage only stores strings
						isSpatialNavEnabled =
							isSpatialNavEnabled === 'true'
								? true
								: isSpatialNavEnabled === 'false'
									? false
									: isSpatialNavEnabled;

						// initialize stored state if not set
						if (isSpatialNavEnabled === null) {
							isSpatialNavEnabled = true;
							localStorage.setItem('isEnabled', true);
						}

						// check to see if key combo matches an action
						var result = 11; // INVALID
						try {
							if (HELPER_FUNCTIONS.isHotkeyPressed('navUp')) {
								result = 0;
							} else if (HELPER_FUNCTIONS.isHotkeyPressed('navLeft')) {
								result = 4;
							} else if (HELPER_FUNCTIONS.isHotkeyPressed('navDown')) {
								result = 2;
							} else if (HELPER_FUNCTIONS.isHotkeyPressed('navRight')) {
								result = 5;
							} else if (HELPER_FUNCTIONS.isHotkeyPressed('jump')) {
								result = 6;
							} else if (HELPER_FUNCTIONS.isHotkeyPressed('click')) {
								result = 8;
							}
						} catch (e) {
							// ignore errors in key detection
						}

						// check to see if the key combo is the enable/disable command
						try {
							if (HELPER_FUNCTIONS.isHotkeyPressed('disableKeys')) {
								// flip the value in storage
								isSpatialNavEnabled = !isSpatialNavEnabled;
								localStorage.setItem('isEnabled', isSpatialNavEnabled);
							}
						} catch (e) {
							// ignore errors
						}

						// prevent other keys when disabled
						if (!isSpatialNavEnabled) return 11; // INVALID

						return result;
					}
					exports.key2command = key2command;

					// Hold configured shortcut to go home
					var homeTimer = null;
					var homeKeyMap = {};

					function initHomeHandler() {
						var settingsLoaded = setInterval(function () {
							if (window.__MEMOTE_HOTKEY_CODES) {
								homeKeyMap = window.__MEMOTE_HOTKEY_CODES;
								clearInterval(settingsLoaded);
							}
						}, 50);
						document.addEventListener('keydown', handleHomeKeydown);
						document.addEventListener('keyup', handleHomeKeyUp);
					}

					function handleHomeKeydown(e) {
						var homeUrl = window.MEMOTE_SITE.getHomeUrl();
						if (!homeUrl || !homeKeyMap.home) return;
						var isHomePressed = HELPER_FUNCTIONS.isHotkeyPressed('home');
						if (isHomePressed && !homeTimer) {
							homeTimer = setTimeout(function () {
								window.location.href = homeUrl;
							}, 1000);
						}
					}

					function handleHomeKeyUp(e) {
						if (homeTimer) {
							clearTimeout(homeTimer);
							homeTimer = null;
						}
					}

					initHomeHandler();
				},
				{ helperFunctions: 13 }
			],
			3: [
				function (require, module, exports) {
					'use strict';
					var MODEL = require('../model/model');
					var VIEW = require('../view/view');
					function Controller(targets) {
						return targets.map(function (target) {
							return new VIEW.View(target);
						});
					}
					exports.Controller = Controller;
					function command(entity, attribute) {
						MODEL.input(entity, attribute);
					}
					exports.command = command;
				},
				{ '../model/model': 8, '../view/view': 12 }
			],
			4: [function (require, module, exports) {}, {}],
			5: [
				function (require, module, exports) {
					'use strict';
					var Entity = (function () {
						function Entity(viewId) {
							this.viewId_ = viewId;
						}
						Object.defineProperty(Entity.prototype, 'viewId', {
							get: function () {
								return this.viewId_;
							},
							set: function (_) {
								return;
							},
							enumerable: true,
							configurable: true
						});
						return Entity;
					})();
					exports.Entity = Entity;
				},
				{}
			],
			6: [
				function (require, module, exports) {
					'use strict';
					var model = require('./model/model');
					model.main();
				},
				{ './model/model': 8 }
			],
			7: [
				function (require, module, exports) {
					'use strict';
					var ATTRIBUTE = require('../attribute/attribute');
					var SELECTOR = [
						'a',
						'input',
						'select',
						'option',
						'datalist',
						'textarea',
						'button',
						'audio',
						'video',
						'embed',
						'[onclick]',
						'[tabindex]:not([role="tablist"]):not(ul):not(#hdtb):not(#hdtbMenus):not([role="main"]):not([tabindex="-1"])',
						'[role="button"]',
						'[role="checkbox"]',
						'[role="option"]',
						'[role="tab"]',
						'[role="menuitem"]'
					].join(',');
					var queried,
						linkcount = 0;
					function analyze(data) {
						if (
							!queried ||
							!data.attribute.cursor ||
							linkcount !== document.links.length
						) {
							queried = Array.apply(null, document.querySelectorAll(SELECTOR));
							linkcount = document.links.length;
						}
						var winWidth = window.innerWidth,
							winHeight = window.innerHeight,
							winTop = window.scrollY,
							winLeft = window.scrollX;
						var rects = new Map();
						if (queried) {
							for (var i = 0; i < queried.length; i++) {
								var el = queried[i];
								if (el && el.getBoundingClientRect) {
									rects.set(el, el.getBoundingClientRect());
								}
							}
						}
						var targets = findTargets(
							queried.filter(function (target) {
								return isVisible(shiftVisibleImg(target));
							}),
							data.attribute.command,
							data.attribute.cursor,
							rects
						);
						queried = isInWindow(targets[0]) ? queried : null;
						return {
							entity: data.entity,
							attribute: data.attribute,
							result: {
								targets: targets
							}
						};
						function findTargets(targets, command, cursor, rects) {
							cursor = isCursorActive(cursor, rects) ? cursor : null;
							switch (command) {
								case 0 /* UP */:
									return !cursor
										? findLeftTops(targets)
										: findCursorTops(targets, cursor);
								case 1 /* UP_S */:
									return !cursor
										? findLeftTops(targets)
										: findCursorColumn(findCursorTops(targets, cursor), cursor);
								case 2 /* DOWN */:
									return !cursor
										? findMainColumn(targets)
										: findCursorBottoms(targets, cursor);
								case 3 /* DOWN_S */:
									return !cursor
										? findMainColumn(targets)
										: findCursorColumn(
												findCursorBottoms(targets, cursor),
												cursor
											);
								case 4 /* LEFT */:
									return !cursor
										? findLeftColumn(targets)
										: findCursorLefts(targets, cursor);
								case 5 /* RIGHT */:
									return !cursor
										? findRightColumn(targets)
										: findCursorRights(targets, cursor);
								case 6 /* JUMP */:
									return findCursorNeerTargets(
										targets,
										cursor || findMainColumn(targets)[0] || document.body
									).filter(isInWindow);
								default:
									return [];
							}
							function findLeftTops(targets) {
								return targets
									.filter(isInWindow)
									.map(shiftVisibleImg)
									.sort(compareLeftTopDistance);
							}
							function findMainColumn(targets) {
								return findColumn(
									function (t) {
										var rect = rects.get(t);
										return (
											(rect ? rect.left : t.getBoundingClientRect().left) <
											winWidth / 2
										);
									},
									true,
									targets
								);
							}
							function findLeftColumn(targets) {
								var mainColumn = findMainColumn(targets);
								var left =
									mainColumn.length > 0
										? (
												rects.get(mainColumn[0].parentElement) ||
												mainColumn[0].parentElement.getBoundingClientRect()
											).left
										: Infinity;
								return findColumn(
									function (t) {
										var rect = rects.get(t);
										return (
											(rect ? rect.right : t.getBoundingClientRect().right) <
											left
										);
									},
									false,
									targets,
									mainColumn
								);
							}
							function findRightColumn(targets) {
								var mainColumn = findMainColumn(targets);
								var right =
									mainColumn.length > 0
										? (
												rects.get(mainColumn[0].parentElement) ||
												mainColumn[0].parentElement.getBoundingClientRect()
											).right
										: -Infinity;
								return findColumn(
									function (t) {
										var rect = rects.get(t);
										return (
											(rect ? rect.left : t.getBoundingClientRect().left) >
											right
										);
									},
									false,
									targets,
									mainColumn
								);
							}
							function findColumn(filterFn, isMain, targets, initialGroup) {
								return columns(
									isMain
										? targets.filter(filterFn).filter(hasVisibleTextNode)
										: targets.filter(filterFn)
								)
									.map(function (group) {
										return group.filter(isInWindow);
									})
									.filter(function (group) {
										return group.length > 0;
									})
									.sort(compareGroupsByTextWeightAverage)
									.reduce(
										function (_, group) {
											return group;
										},
										isMain ? findLeftTops(targets) : initialGroup
									)
									.map(shiftVisibleImg)
									.sort(compareLeftTopDistance);
							}
							function findCursorTargets(targets, cursor, bounds, comparator) {
								var margin = 3;
								return targets
									.map(shiftVisibleImg)
									.filter(
										isInRange(
											bounds.top,
											bounds.left,
											bounds.right,
											bounds.bottom + margin
										)
									)
									.sort(comparator(cursor));
							}
							function findCursorTops(targets, cursor) {
								return findCursorTargets(
									targets,
									cursor,
									{
										top: Math.max(winTop - winHeight * 3, 0),
										left: winLeft,
										right: winLeft + winWidth,
										bottom: Offset(cursor).top
									},
									compareCursorVerticalDistance
								);
							}
							function findCursorBottoms(targets, cursor) {
								return findCursorTargets(
									targets,
									cursor,
									{
										top: Offset(cursor).bottom - 3,
										left: winLeft,
										right: winLeft + winWidth,
										bottom: winTop + winHeight * 4
									},
									compareCursorVerticalDistance
								);
							}
							function findCursorLefts(targets, cursor) {
								return findCursorTargets(
									targets,
									cursor,
									{
										top: winTop,
										left: 0,
										right: Offset(cursor).left + 3,
										bottom: winTop + winHeight
									},
									compareCursorLeftDistance
								);
							}
							function findCursorRights(targets, cursor) {
								return findCursorTargets(
									targets,
									cursor,
									{
										top: winTop,
										left: Offset(cursor).right - 3,
										right: Infinity,
										bottom: winTop + winHeight
									},
									compareCursorRightDistance
								);
							}
							function findCursorNeerTargets(targets, cursor) {
								return targets
									.map(shiftVisibleImg)
									.filter(isInWindow)
									.sort(compareCursorDistance(cursor));
							}
							function findCursorColumn(targets, cursor) {
								var cursorRect = rects.get(cursor);
								var left = cursorRect
									? cursorRect.left
									: cursor.getBoundingClientRect().left;
								return columns(
									targets.filter(isCursorColumn).filter(hasVisibleTextNode)
								)
									.reduce(function (_, group) {
										return group;
									}, targets)
									.map(shiftVisibleImg)
									.sort(function (a, b) {
										return (
											compareGroupsByTextWeightAverage([b], [a]) ||
											compareLeftTopDistance(a, b)
										);
									});
								function isCursorColumn(elem) {
									var elemRect = rects.get(elem);
									return (
										(elemRect
											? elemRect.left
											: elem.getBoundingClientRect().left) === left
									);
								}
							}
							function isCursorActive(cursor, rects) {
								var rect = rects && rects.get(cursor);
								if (!rect && cursor) rect = cursor.getBoundingClientRect();
								return !(
									!rect ||
									rect.bottom < 0 ||
									rect.top > winHeight ||
									rect.right < 0 ||
									rect.left > winWidth
								);
							}
							function columns(targets) {
								function depth(e) {
									var d = 0,
										p = e;
									while ((p = p.parentElement)) ++d;
									return d;
								}
								return targets
									.sort(compareLeftDistance)
									.reduce(groupsByLeftDistance, [])
									.map(function (group) {
										return group
											.sort(function (a, b) {
												return depth(a) - depth(b);
											})
											.reduce(function (r, elem) {
												return r.length === 0
													? [[elem]]
													: depth(r[0][0]) === depth(elem)
														? [[elem].concat(r[0])].concat(r.slice(1))
														: [[elem]].concat(r);
											}, [])
											.filter(function (g) {
												return g.length > 1;
											})
											.reduce(function (r, g) {
												return r.concat(g);
											}, []);
									})
									.filter(function (group) {
										return group.length > 1;
									});
							}
							function groupsByLeftDistance(groups, elem) {
								if (groups.length === 0) {
									return [[elem]];
								}
								var group = groups.slice(-1)[0];
								var rectA = rects.get(group[0]);
								var rectB = rects.get(elem);
								var same =
									Math.floor(
										rectA ? rectA.left : group[0].getBoundingClientRect().left
									) ===
									Math.floor(
										rectB ? rectB.left : elem.getBoundingClientRect().left
									);
								return same
									? groups.slice(0, -1).concat([group.concat(elem)])
									: groups.concat([[elem]]);
							}
							function compareGroupsByTextWeightAverage(a, b) {
								return (
									calcTextWeightAverage(a.filter(hasText).slice(0, 10)) -
										calcTextWeightAverage(b.filter(hasText).slice(0, 10)) ||
									-compareLeftDistance(a[0], b[0])
								);
								function calcTextWeightAverage(elems) {
									return elems.length === 0
										? 0
										: (elems.reduce(function (r, elem) {
												var parents = findVisibleTextNodes(elem).map(
													function (t) {
														return t.parentElement;
													}
												);
												var weight = calcFontWeightRateAverage(parents);
												var len = parents.reduce(function (a, p) {
													return a + p.textContent.trim().length;
												}, 0);
												return (
													r +
													(parseInt(
														window.getComputedStyle(elem).fontSize,
														10
													) ||
														parseInt(
															window.getComputedStyle(document.documentElement)
																.fontSize,
															10
														) ||
														16) *
														weight *
														+(len > 3)
												);
											}, 0) /
												elems.length) *
												(Math.min(elems.length, 10) / 10 + 0.5);
								}
								function calcFontWeightRateAverage(textNodeParents) {
									var longest = textNodeParents.reduce(function (a, b) {
										return a.textContent.trim().length >=
											b.textContent.trim().length
											? a
											: b;
									});
									return calFontWeightRate(longest);
								}
								function calFontWeightRate(elem) {
									var fontWeight = window.getComputedStyle(elem).fontWeight;
									var weight =
										fontWeight === 'bold'
											? 700
											: fontWeight === 'normal'
												? 400
												: parseInt(fontWeight, 10) || 400;
									return 1 + (weight / 400 - 1) / 3;
								}
							}
							function compareLeftDistance(a, b) {
								var rectA = rects.get(a);
								var rectB = rects.get(b);
								return (
									(rectA ? rectA.left : a.getBoundingClientRect().left) -
									(rectB ? rectB.left : b.getBoundingClientRect().left)
								);
							}
							function compareLeftTopDistance(a, b) {
								var rectA = rects.get(a);
								if (!rectA) rectA = a.getBoundingClientRect();
								var rectB = rects.get(b);
								if (!rectB) rectB = b.getBoundingClientRect();
								return (
									Math.floor(rectA.left + rectA.top * 5) -
									Math.floor(rectB.left + rectB.top * 5)
								);
							}
							function compareCursorDistance(cursor) {
								return makeCursorDistance(cursor, function (t, c) {
									return (
										Math.abs(t.left - c.left) + Math.abs(t.top - c.top) * 10
									);
								});
							}
							function compareCursorVerticalDistance(cursor) {
								return makeCursorDistance(cursor, function (t, c) {
									var hdist =
										t.left <= c.left && c.left <= t.right ? 0 : t.left - c.left;
									return Math.abs(hdist) * 3 + Math.abs(t.top - c.top);
								});
							}
							function compareCursorLeftDistance(cursor) {
								return makeCursorDistance(cursor, function (t, c) {
									return (
										Math.abs(t.right - c.left) + Math.abs(t.top - c.top) * 5
									);
								});
							}
							function compareCursorRightDistance(cursor) {
								return makeCursorDistance(cursor, function (t, c) {
									return (
										Math.abs(t.left - c.right) + Math.abs(t.top - c.top) * 5
									);
								});
							}
							function makeCursorDistance(cursor, formula) {
								var cursorOffset = Offset(cursor);
								return function (a, b) {
									return (
										Math.floor(formula(Offset(a), cursorOffset)) -
										Math.floor(formula(Offset(b), cursorOffset))
									);
								};
							}
						}
						function isInWindow(elem) {
							return (
								!!elem &&
								isInRange(
									winTop,
									winLeft,
									winLeft + winWidth,
									winTop + winHeight
								)(elem)
							);
						}
						function isInRange(top, left, right, bottom) {
							return function (elem) {
								var offset = Offset(elem);
								// Ensure element is fully within viewport with margin
								// This prevents selecting elements that are partially or mostly off-screen
								return (
									!!elem &&
									offset.top >= top &&
									offset.top <= bottom - 10 &&
									offset.bottom <= bottom + 10 &&
									offset.left >= left &&
									offset.left <= right - 10 &&
									offset.right <= right + 10
								);
							};
						}
						function hasVisibleTextNode(elem) {
							return findVisibleTextNodes(elem).length > 0;
						}
						function findVisibleTextNodes(elem) {
							return findTextNodes(elem)
								.filter(hasText)
								.filter(function (text) {
									return isVisible(text.parentElement);
								});
						}
						function findTextNodes(elem) {
							var result = [],
								stack = [elem];
							while (stack.length > 0) {
								var cur = stack.pop();
								for (var i = 0; i < cur.childNodes.length; i++) {
									var child = cur.childNodes[i];
									if (child.nodeType === 3) {
										result.push(child);
									} else if (child.nodeType === 1) {
										stack.push(child);
									}
								}
							}
							return result;
						}
						function hasText(elem) {
							return elem.textContent.trim().length > 0;
						}
						function shiftVisibleImg(elem) {
							// Don't shift to images - return the element itself
							// This ensures links containing images get focus, not the image
							return elem;
						}
						function isVisible(elem) {
							var rect = elem.getBoundingClientRect(),
								point = document.elementFromPoint(
									Math.ceil(rect.left + rect.width / 2),
									Math.ceil(rect.top + Math.min(rect.height / 2, 10))
								);
							return point
								? isVisibleSize(elem) &&
										(point === elem || isChild(elem, point))
								: isVisibleSize(elem) && isVisibleStyle(elem);
							function isChild(parent, child) {
								return child
									? child.parentElement === parent ||
											isChild(parent, child.parentElement)
									: false;
							}
							function isVisibleSize(elem) {
								return elem.offsetWidth > 9 && elem.offsetHeight > 9;
							}
							function isVisibleStyle(elem) {
								var style = window.getComputedStyle(elem);
								return (
									style.display.split(' ')[0] !== 'none' ||
									style.visibility.split(' ')[0] !== 'hidden' ||
									!(parseInt(style.zIndex.split(' ')[0], 10) < 0)
								);
							}
						}
						function Offset(elem) {
							var offset = elem.getBoundingClientRect();
							return {
								top: winTop + offset.top,
								left: winLeft + offset.left,
								right: winLeft + offset.right,
								bottom: winTop + offset.bottom,
								width: offset.right - offset.left,
								height: offset.bottom - offset.top
							};
						}
					}
					exports.analyze = analyze;
				},
				{ '../attribute/attribute': 2 }
			],
			8: [
				function (require, module, exports) {
					'use strict';
					var VIEW = require('../view/view');
					var CONTROLLER = require('../controller/controller');
					var STORE = require('../store/store');
					exports.store = STORE.create();
					var ANALYSIS = require('./analysis');
					var HELPER_FUNCTIONS = require('helperFunctions');
					var views = [];
					function main() {
						if (document.readyState === 'loading') {
							return window.addEventListener('DOMContentLoaded', register);
						} else {
							return register();
						}
						function register() {
							window.removeEventListener('DOMContentLoaded', register);
							HELPER_FUNCTIONS.getSettings();
							HELPER_FUNCTIONS.startListeners();
							CONTROLLER.Controller([window]).forEach(function (view) {
								return views.unshift(view);
							});
						}
					}
					exports.main = main;
					var _debounceTimer = null;
					function input(entity, attribute) {
						clearTimeout(_debounceTimer);
						_debounceTimer = setTimeout(function () {
							var data = { entity: entity, attribute: attribute, result: null };
							data = ANALYSIS.analyze(data);
							output(data);
						}, 10);
					}
					exports.input = input;
					function output(data) {
						exports.store.update(data.entity.viewId, data.result);
						VIEW.emit(data.entity, data.attribute);
					}
				},
				{
					'../controller/controller': 3,
					'../store/store': 10,
					'../view/view': 12,
					'./analysis': 7,
					helperFunctions: 13
				}
			],
			9: [
				function (require, module, exports) {
					'use strict';
					var state_ = 0; /* ENABLE */
					function state(enable) {
						switch (enable) {
							case true:
								state_ = 0; /* ENABLE */
								break;
							case false:
								state_ = 1; /* DISABLE */
								break;
						}
						return state_ === 0; /* ENABLE */
					}
					exports.state = state;
				},
				{}
			],
			10: [
				function (require, module, exports) {
					'use strict';
					function create() {
						return new Store();
					}
					exports.create = create;
					var Store = (function () {
						function Store() {
							this.state_ = {};
							this.diff_ = {};
						}
						Store.prototype.update = function (id, diff) {
							var curState = (this.state_[id] = this.state_[id] || {}),
								curDiff = (this.diff_[id] = this.diff_[id] || []);
							Object.keys(diff).forEach(function (v) {
								var key = v,
									val = diff[key];
								if (val === curState[key]) {
									return;
								}
								curState[key] = val;
								curDiff.push(key);
							});
						};
						Store.prototype.state = function (id) {
							return (this.state_[id] = this.state_[id] || {});
						};
						Store.prototype.diff = function (id) {
							var diff = (this.diff_[id] = this.diff_[id] || []),
								uniq = diff
									.sort()
									.reduce(function (r, v, i) {
										return i === 0 ? [v] : r[0] === v ? r : [v].concat(r);
									}, [])
									.reverse();
							[].splice.apply(diff, [0, diff.length].concat(uniq));
							return diff;
						};
						return Store;
					})();
				},
				{}
			],
			11: [
				function (require, module, exports) {
					'use strict';
					var ATTRIBUTE = require('../attribute/attribute');
					function map(targets, callback) {
						if (targets.length === 0) {
							return [];
						}
						var scrollTop = window.scrollY,
							scrollLeft = window.scrollX;

						// Get configured jump keys from window (set by getSettings on DOMContentLoaded)
						var jumpKeys = [];
						var jumpConfig =
							window.__MEMOTE_HOTKEY_CODES && window.__MEMOTE_HOTKEY_CODES.jump;
						if (jumpConfig) {
							jumpConfig.forEach(function (combo) {
								if (Array.isArray(combo)) {
									combo.forEach(function (key) {
										if (
											key !== 'control' &&
											key !== 'shift' &&
											key !== 'alt' &&
											key !== 'meta'
										) {
											jumpKeys.push(key.toLowerCase());
										}
									});
								}
							});
						}

						// Start with all lowercase letters and remove jump keys
						var allKeys = 'abcdefghijklmnopqrstuvwxyz'.split('');
						var keys = allKeys.filter(function (k) {
							return jumpKeys.indexOf(k) === -1;
						});

						var container = document.createElement('div'),
							observer = document.createElement('input'),
							table = {};
						observer.style.cssText = [
							'position: fixed;',
							'width: 0px;',
							'height: 0px;',
							'bottom: 0px;',
							'right: 0px;',
							'margin: 0px;',
							'border-width: 0px;',
							'padding: 0px;',
							'z-index: -1;'
						]
							.map(function (str) {
								return str.split(';')[0] + ' !important;';
							})
							.join('');

						// Check if overlay is already open - if so, close it
						var existingOverlay = document.querySelector(
							'.' + ATTRIBUTE.MARKER_TAG
						);
						if (existingOverlay) {
							existingOverlay.parentNode.remove();
							var existingInput = document.querySelector(
								'input[style*="position: fixed"]'
							);
							if (existingInput) {
								existingInput.remove();
							}
							return [];
						}

						observer.addEventListener('input', handler);
						observer.addEventListener('blur', handler);
						document.body.appendChild(observer);
						observer.focus();
						var markers = targets
							.slice(0, keys.length)
							.map(function (target, i) {
								var marker = document.createElement('span'),
									key = keys[i],
									offset = calOffset(target);
								marker.classList.add(ATTRIBUTE.MARKER_TAG);
								marker.classList.add(ATTRIBUTE.MARKER_TAG + '-' + key);
								marker.setAttribute('data-memote-marker', 'true');
								marker.style.top = offset.top - 3 + 'px';
								marker.style.left = offset.left - 12 + 'px';
								marker.textContent = key;
								table[key] = target;
								container.appendChild(marker);
								return target;
							});
						document.body.appendChild(container);
						return markers;
						function handler(event) {
							event.preventDefault();
							event.stopImmediatePropagation();
							var key = ja2en(event.target.value),
								shiftKey = key === key.toUpperCase(),
								target = table[key.toLowerCase()],
								controlKey = false;
							observer.removeEventListener('keydown', handler);
							observer.removeEventListener('blur', handler);
							container.remove();

							if (key && target) {
								callback(target, shiftKey, controlKey);
							}
							observer.blur();
							setTimeout(function () {
								return observer.remove();
							}, 1);
						}
						function calOffset(elem) {
							var offset = elem.getBoundingClientRect();
							return {
								top: scrollTop + offset.top,
								left: scrollLeft + offset.left,
								right: scrollLeft + offset.right,
								bottom: scrollTop + offset.bottom
							};
						}
					}
					exports.map = map;
					function ja2en(char) {
						switch (char) {
							case 'ｑ':
								return 'q';
							case 'Ｑ':
								return 'Q';
							case 'ｗ':
								return 'w';
							case 'Ｗ':
								return 'W';
							case 'え':
								return 'e';
							case 'Ｅ':
								return 'E';
							case 'ｒ':
								return 'r';
							case 'Ｒ':
								return 'R';
							case 'ｔ':
								return 't';
							case 'Ｔ':
								return 'T';
							case 'ｙ':
								return 'y';
							case 'Ｙ':
								return 'Y';
							case 'う':
								return 'u';
							case 'Ｕ':
								return 'U';
							case 'い':
								return 'i';
							case 'Ｉ':
								return 'I';
							case 'お':
								return 'o';
							case 'Ｏ':
								return 'O';
							case 'ｐ':
								return 'p';
							case 'Ｐ':
								return 'P';
							case 'あ':
								return 'a';
							case 'Ａ':
								return 'A';
							case 'ｓ':
								return 's';
							case 'Ｓ':
								return 'S';
							case 'ｄ':
								return 'd';
							case 'Ｄ':
								return 'D';
							case 'ｆ':
								return 'f';
							case 'Ｆ':
								return 'F';
							case 'ｇ':
								return 'g';
							case 'Ｇ':
								return 'G';
							case 'ｈ':
								return 'h';
							case 'Ｈ':
								return 'H';
							case 'ｊ':
								return 'j';
							case 'Ｊ':
								return 'J';
							case 'ｋ':
								return 'k';
							case 'Ｋ':
								return 'K';
							case 'ｌ':
								return 'l';
							case 'Ｌ':
								return 'L';
							case 'ｚ':
								return 'z';
							case 'Ｚ':
								return 'Z';
							case 'ｘ':
								return 'x';
							case 'Ｘ':
								return 'X';
							case 'ｃ':
								return 'c';
							case 'Ｃ':
								return 'C';
							case 'ｖ':
								return 'v';
							case 'Ｖ':
								return 'V';
							case 'ｂ':
								return 'b';
							case 'Ｂ':
								return 'B';
							case 'ｎ':
								return 'n';
							case 'Ｎ':
								return 'N';
							case 'ｍ':
								return 'm';
							case 'Ｍ':
								return 'M';
							default:
								return char;
						}
					}
				},
				{ '../attribute/attribute': 2 }
			],
			12: [
				function (require, module, exports) {
					'use strict';
					var ENTITY = require('../entity/entity');
					var ATTRIBUTE = require('../attribute/attribute');
					var MODEL = require('../model/model');
					var CONTROLLER = require('../controller/controller');
					var STATE = require('../state/module');
					var MAP = require('./map');
					var id = 0;
					var views = {};
					exports.state = STATE.state;
					var View = (function () {
						function View(target) {
							this.id_ = ++id;
							this.style = document.createElement('style');
							views[this.id_] = this;
							this.target_ = target;
							this.handler_ = this.handler_.bind(this);
							this.observe_();
							// Cursor styling is now handled by site-loader.js
							// which dynamically sets the color based on site config
						}
						View.prototype.handler_ = function (event) {
							if (!exports.state()) {
								return;
							}
							if (event.defaultPrevented) {
								return;
							}
							if (isInserting(event.srcElement)) {
								return;
							}
							var cursor = document.querySelector('.' + ATTRIBUTE.CURSOR_ID),
								entity = new ENTITY.Entity(this.id_),
								attribute = ATTRIBUTE.attribute(event, cursor);
							if (attribute.command === 11 /* INVALID */) {
								return;
							}
							if (!cursor && attribute.command === 8 /* ENTER */) {
								return;
							}
							event.preventDefault();
							event.stopImmediatePropagation();
							CONTROLLER.command(entity, attribute);
							return;
							function isInserting(elem) {
								switch (elem.tagName.toLowerCase()) {
									case 'input':
										switch (elem.getAttribute('type')) {
											case 'checkbox':
											case 'radio':
											case 'file':
											case 'submit':
											case 'reset':
											case 'button':
											case 'image':
											case 'range':
											case 'color':
												return false;
										}
										return true;
									case 'select':
										return false;
									case 'datalist':
									case 'option':
									case 'textarea':
										return true;
								}
								switch (elem.getAttribute('role')) {
									case 'textbox':
										return true;
								}
								do {
									if (elem.contentEditable === 'true') {
										return true;
									}
								} while ((elem = elem.parentElement));
								return false;
							}
						};
						View.prototype.observe_ = function () {
							this.target_.addEventListener('keydown', this.handler_, true);
						};
						View.prototype.release_ = function () {
							this.target_.removeEventListener('keydown', this.handler_, true);
						};
						View.prototype.destructor = function () {
							this.release_();
							delete views[this.id_];
						};
						View.prototype.update = function (command) {
							if (!this.style.parentElement) {
								document.head.appendChild(this.style);
							}
							var state = MODEL.store.state(this.id_),
								diff = MODEL.store.diff(this.id_);
							var key;
							while ((key = diff.shift())) {
								switch (key) {
									case 'targets':
										markTarget(state.targets);
								}
							}
							function markTarget(targets) {
								switch (command) {
									case 0 /* UP */:
									case 1 /* UP_S */:
									case 2 /* DOWN */:
									case 3 /* DOWN_S */:
									case 4 /* LEFT */:
									case 5 /* RIGHT */:
										var target = targets[0];
										if (!target) {
											break;
										}
										select(target);
										// Smooth scrolling to center element
										target.scrollIntoView({
											behavior: 'smooth',
											block: 'center',
											inline: 'center'
										});
										break;
									case 6 /* JUMP */:
										MAP.map(targets, trigger);
										break;
									case 8 /* ENTER */:
										trigger(
											document.querySelector('.' + ATTRIBUTE.CURSOR_ID),
											false,
											false
										);
										break;
									default:
										unselect();
								}
								return;
								function select(elem) {
									unselect();
									elem.classList.add(ATTRIBUTE.CURSOR_ID);
								}
								function unselect() {
									var selector = document.querySelector(
										'.' + ATTRIBUTE.CURSOR_ID
									);
									if (!selector) {
										return;
									}
									selector.classList.remove(ATTRIBUTE.CURSOR_ID);
								}
								function trigger(cursor, shiftKey, ctrlKey) {
									if (!cursor) {
										return;
									}
									if (
										!document.elementFromPoint(
											cursor.getBoundingClientRect().left,
											cursor.getBoundingClientRect().top
										)
									) {
										return;
									}
									if (
										cursor.tagName.toLowerCase() === 'a' ||
										cursor.parentElement.tagName.toLowerCase() === 'a' ||
										cursor.onclick ||
										cursor.tagName.toLowerCase() === 'option' ||
										-1 < ['button'].indexOf(cursor.getAttribute('role'))
									) {
										select(cursor);
									} else {
										unselect();
									}
									cursor.focus();
									click(cursor, shiftKey, ctrlKey);
								}
							}
						};
						View.prototype.destroy = function () {
							this.destructor();
						};
						return View;
					})();
					exports.View = View;
					function emit(entity, attribute) {
						var viewId = entity.viewId;
						if (viewId in views) {
							views[viewId].update(attribute.command);
							return true;
						} else {
							return false;
						}
					}
					exports.emit = emit;
					function click(elem, shiftKey, ctrlKey) {
						var target = elem.hasAttribute('target')
							? elem.getAttribute('target')
							: null;
						if (elem.tagName.toLowerCase() === 'a') {
							elem.removeAttribute('target');
						}
						['mouseover', 'mousedown', 'mouseup', 'click'].forEach(
							function (name) {
								elem.dispatchEvent(
									new MouseEvent(name, {
										bubbles: true,
										cancelable: true,
										clientX: 0,
										clientY: 0,
										ctrlKey: !!ctrlKey,
										shiftKey: !!shiftKey
									})
								);
							}
						);
						if (elem.tagName.toLowerCase() === 'a' && target) {
							elem.setAttribute('target', target);
						}
					}
				},
				{
					'../attribute/attribute': 2,
					'../controller/controller': 3,
					'../entity/entity': 5,
					'../model/model': 8,
					'../state/module': 9,
					'./map': 11
				}
			]
		},
		{},
		[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
	);
})('spatial-navigation', '0.4.7');
