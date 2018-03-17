// ==UserScript==
// @name         Google - Middle Click Search
// @namespace    https://greasyfork.org/users/649
// @version      1.1.2
// @description  Opens search results in new tab when you middle click
// @author       Adrien Pyke
// @include      /^https?:\/\/www\.google\.[a-zA-Z]+\/?(?:\?.*)?$/
// @include      /^https?:\/\/www\.google\.[a-zA-Z]+\/search\/?\?.*$/
// @require      https://cdn.rawgit.com/fuzetsu/userscripts/477063e939b9658b64d2f91878da20a7f831d98b/wait-for-elements/wait-for-elements.js
// @grant        GM_openInTab
// ==/UserScript==

(() => {
	'use strict';

	const setQueryParam = function(key, value, url = location.href) {
		const regex = new RegExp(`([?&])${key}=.*?(&|#|$)(.*)`, 'gi');
		const hasValue = (typeof value !== 'undefined' && value !== null && value !== '');
		if (regex.test(url)) {
			if (hasValue) {
				return url.replace(regex, `$1${key}=${value}$2$3`);
			} else {
				let [path, hash] = url.split('#');
				url = path.replace(regex, '$1$3').replace(/(&|\?)$/, '');
				if (hash) url += `#${hash[1]}`;
				return url;
			}
		} else if (hasValue) {
			let separator = url.includes('?') ? '&' : '?';
			let [path, hash] = url.split('#');
			url = `${path + separator + key}=${value}`;
			if (hash) url += `#${hash[1]}`;
			return url;
		} else return url;
	};

	const getUrl = function(value) {
		if (window.location.href.match(/^https?:\/\/www\.google\.[a-zA-Z]+\/search\/?\?.*$/)) {
			return setQueryParam('q', encodeURIComponent(value));
		} else {
			return `${location.protocol}//${location.host}/search?q=${encodeURIComponent(value)}`;
		}
	};

	waitForElems({
		sel: '#_fZl',
		onmatch(btn) {
			let input = document.querySelector('#lst-ib');

			btn.onmousedown = e => {
				if (e.button === 1) {
					e.preventDefault();
				}
			};

			btn.onclick = e => {
				if (e.button === 1 && input.value.trim()) {
					e.preventDefault();
					e.stopImmediatePropagation();
					let url = getUrl(input.value);
					GM_openInTab(url, true);
					return false;
				}
			};

			btn.onauxclick = btn.onclick;
		}
	});

	waitForElems({
		sel: '.sbsb_b li .sbqs_c, .sbsb_b li .sbpqs_d',
		onmatch(elem) {
			elem.onclick = e => {
				if (e.button === 1) {
					e.preventDefault();
					e.stopImmediatePropagation();
					let text = elem.classList.contains('sbpqs_d') ? elem.querySelector('span').textContent : elem.textContent;
					let url = getUrl(text);
					GM_openInTab(url, true);
					return false;
				}
			};
			elem.onauxclick = elem.onclick;
		}
	});
})();
