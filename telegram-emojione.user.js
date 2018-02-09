// ==UserScript==
// @name         Telegram Web Emojione
// @namespace    https://greasyfork.org/users/649
// @version      1.0.4
// @description  Replaces old iOS emojis with Emojione on Telegram Web
// @author       Adrien Pyke
// @match        *://web.telegram.org/*
// @grant        none
// @require      https://greasyfork.org/scripts/38329-emojione-min-js/code/emojioneminjs.js?version=250047
// @require      https://greasyfork.org/scripts/5679-wait-for-elements/code/Wait%20For%20Elements.js?version=147465
// ==/UserScript==

(function() {
	'use strict';

	var SCRIPT_NAME = 'Telegram Web Emojione';

	var Util = {
		log: function() {
			var args = [].slice.call(arguments);
			args.unshift('%c' + SCRIPT_NAME + ':', 'font-weight: bold;color: #233c7b;');
			console.log.apply(console, args);
		},
		q: function(query, context) {
			return (context || document).querySelector(query);
		},
		qq: function(query, context) {
			return [].slice.call((context || document).querySelectorAll(query));
		},
		appendStyle: function(str) {
			var style = document.createElement('style');
			style.textContent = str;
			document.head.appendChild(style);
		},
		regexEscape: function(str) {
			return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
		},
		textContentWithBreaks: function(node) {
			var lines = [];
			node.innerHTML.split('<br>').forEach(function(line) {
				var tempDiv = document.createElement('div');
				tempDiv.innerHTML = line;
				lines.push(tempDiv.textContent);
			});
			return lines.join('\n');
		}
	};

	var sizes = [
		{
			size: 20
		}, {
			class: 'im_short_message_text',
			size: 18
		}, {
			class: 'composer_emoji_tooltip',
			size: 26
		}
	];

	Util.appendStyle(sizes.map(function(size) {
		var output = '';
		if (size.class) {
			output = '.' + size.class;
		}
		return output + ' .emojione {width: ' + size.size + 'px;}';
	}).join(''));

	var replacements = {
		':+1:': ':thumbsup:',
		':facepunch:': ':punch:',
		':hand:': ':raised_hand:',
		':moon:': ':waxing_gibbous_moon:',
		':phone:': ':telephone:',
		':hocho:': ':knife:',
		':boat:': ':sailboat:',
		':car:': ':red_car:',
		':large_blue_circle:': ':blue_circle:'
	};

	var convert = function(msg) {
		var content = Util.textContentWithBreaks(msg);
		for (var property in replacements) {
			if (replacements.hasOwnProperty(property)) {
				content = content.replace(new RegExp(Util.regexEscape(property), 'g'), replacements[property]);
			}
		}

		msg.innerHTML = emojione.toImage(emojione.shortnameToUnicode(content));
	};

	var selectors = [
		'.im_message_text',
		'.im_message_author',
		'.im_message_webpage_site',
		'.im_message_webpage_title',
        '.im_message_webpage_description',
		'.im_short_message_text',
		'.im_dialog_peer > span'
	];

	waitForElems({
		sel: selectors.join(','),
		onmatch: function(msg) {
			convert(msg);
			setTimeout(function() {
				Util.log(msg.innerHTML);
				if (msg.innerHTML.indexOf('<img') === -1) {
					convert(msg);
				}
			}, 200);
		}
	});

	waitForElems({
		sel: '.composer_emoji_btn',
		onmatch: function(btn) {
			btn.innerHTML = emojione.toImage(replacements[btn.title] || btn.title);
		}
	});
})();
