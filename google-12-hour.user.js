// ==UserScript==
// @name         Google, 12 hour date-time picker
// @namespace    https://greasyfork.org/users/649
// @version      1.0
// @description  Switches the date time picker on google searches to a 12 hour clock
// @author       Adrien Pyke
// @include      /^https?:\/\/www\.google\.[a-zA-Z]+\/.*$/
// @grant        none
// @require      https://greasyfork.org/scripts/5679-wait-for-elements/code/Wait%20For%20Elements.js?version=147465
// ==/UserScript==

(function() {
	'use strict';

	var Util = {
		q: function(query, context) {
			return (context || document).querySelector(query);
		},
		qq: function(query, context) {
			return [].slice.call((context || document).querySelectorAll(query));
		}
	};

	waitForElems({
		sel: '.tdu-datetime-picker > div.tdu-t > div:nth-child(1) > div > ul',
		onmatch: function(hourSelector) {
			Util.qq('li', hourSelector).forEach(function(hour) {
				var value = parseInt(hour.dataset.value);
				if (value === 0) {
					hour.textContent = 'AM 12';
				} else if (value === 12) {
					hour.textContent = 'PM 12';
				} else {
					hour.textContent = (value < 12 ? 'AM ' : 'PM ') + (value % 12);
				}
			});
		}
	});
})();