// ==UserScript==
// @name         Prevent Wikia Ads
// @namespace    https://greasyfork.org/users/649
// @version      1.0
// @description  Prevent the ads that pop up when clicking a link to an external page on Wikias
// @author       Adrien Pyke
// @match        *://*.wikia.com/*
// @require      https://greasyfork.org/scripts/5679-wait-for-elements/code/Wait%20For%20Elements.js?version=122976
// @grant        GM_openInTab
// ==/UserScript==

(function() {
	'use strict';

	waitForElems('a.exitstitial', function(link) {
		link.onclick = function(e) {
			e.preventDefault();
			e.stopImmediatePropagation();
			if (e.button === 1) {
				GM_openInTab(link.href, true);
			} else {
				location.href = link.href;
			}
			return false;
		};
	});
})();