// ==UserScript==
// @name         Loft Lounge Board Game Filters
// @namespace    https://greasyfork.org/users/649
// @version      1.0.5
// @description  Adds Filters to the Loft Lounge board game page
// @author       Adrien Pyke
// @match        *://www.theloftlounge.ca/pages/board-games*
// @match        *://www.theloftlounge.ca/pages/new-games*
// @grant        none
// ==/UserScript==

(function() {
	'use strict';

	var SCRIPT_NAME = 'Loft Lounge Board Game Filters';

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
		prepend: function(parent, child) {
			parent.insertBefore(child, parent.firstChild);
		},
		createTextbox: function() {
			var input = document.createElement('input');
			input.type = 'text';
			return input;
		},
		createCheckbox: function(lbl) {
			var label = document.createElement('label');
			var checkbox = document.createElement('input');
			checkbox.setAttribute('type', 'checkbox');
			label.appendChild(checkbox);
			label.appendChild(document.createTextNode(lbl));
			return label;
		},
		createButton: function(text, onclick) {
			var button = document.createElement('button');
			button.textContent = text;
			button.onclick = onclick;
			return button;
		},
		onlyUnique: function(value, index, self) {
		    return self.indexOf(value) === index;
		},
		toTitleCase: function(str) {
			return str.replace(/\w\S*/g, function(txt){
				return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
			});
		},
		appendStyle: function(str) {
			var style = document.createElement('style');
			style.textContent = str;
			document.head.appendChild(style);
		}
	};

	Util.appendStyle(
		'#sidebar-holder, #content-holder {' +
		'	position: static!important;' +
		'	height: auto!important;' +
		'}' +
		'#content {' +
		'	position: static!important;' +
		'	margin-left: 290px;' +
		'	width: auto;' +
		'}' +
		'#content-holder {' +
		'	width: 100%!important;' +
		'	float: right;' +
		'}' +
		'@media (max-width: 900px), (max-device-width: 1024px) {' +
		'	#content {' +
		'		margin-left: 0px;' +
		'	}' +
		'}'
	);

	var table = Util.q('#page-content > div > table > tbody');
	var rows = Util.qq('tr', table);
	var categories = rows.map(function(row) {
		var typos = {
			'Basment': 'Basement',
			'Basment Game': 'Basement',
			'2-player Small': 'Two Player Small'
		};
		var td = Util.q('td:nth-of-type(2)', row);
		var category = Util.toTitleCase(td.textContent.trim());
		if (typos[category]) {
			td.textContent = category = typos[category];
		}
		return category;
	}).filter(Util.onlyUnique).sort();

	var tr = document.createElement('tr');
	var td1 = document.createElement('td');
	td1.style.width = '75%';
	var td2 = document.createElement('td');
	td2.style.width = '25%';
	tr.appendChild(td1);
	tr.appendChild(td2);

	var nameFilter = Util.createTextbox();
	td1.appendChild(nameFilter);

	var selectedCategories = [];

	var filter = function() {
		rows.forEach(function(row) {
			row.style.display = 'none';
		});
		var rowsFilter = rows;

		if (selectedCategories.length > 0) {
			rowsFilter = rowsFilter.filter(function(row) {
				var category = Util.q('td:nth-of-type(2)', row).textContent.trim().toLowerCase();
				return selectedCategories.includes(category);
			});
		}

		var value = nameFilter.value.trim().toLowerCase();
		if (value) {
			rowsFilter = rowsFilter.filter(function(row) {
				var name = Util.q('td:nth-of-type(1)', row).textContent.trim().toLowerCase();
				return name.indexOf(value) !== -1;
			});
		}

		rowsFilter.forEach(function(row) {
			row.style.display = 'table-row';
		});
	};

	nameFilter.oninput = filter;

	var categoryDiv = document.createElement('div');
	categoryDiv.style.border = '1px solid black';
	categoryDiv.style.backgroundColor = 'white';
	categoryDiv.style.color = 'black';
	categoryDiv.style.position = 'absolute';
	categoryDiv.style.display = 'none';
	categoryDiv.style.zIndex = 9999;

	var categorySpan = document.createElement('span');

	categories.forEach(function(category) {
		var label = Util.createCheckbox(category);
		categoryDiv.appendChild(label);
		categoryDiv.appendChild(document.createElement('br'));
		var check = Util.q('input', label);
		check.onchange = function(e) {
			var cat = category.trim().toLowerCase();
			var index = selectedCategories.indexOf(cat);
			if (check.checked) {
				if (index === -1) {
					selectedCategories.push(cat);
				}
			} else {
				if (index !== -1) {
					selectedCategories.splice(index, 1);
				}
			}
			categorySpan.textContent = selectedCategories.map(function(category) {
				return Util.toTitleCase(category);
			}).join(', ');
			filter();
		};
	});

	var categoryButton = Util.createButton('Categories...', function(e) {
		if (categoryDiv.style.display === 'none') {
			categoryDiv.style.display = 'block';
		} else {
			categoryDiv.style.display = 'none';
		}
	});

	document.body.addEventListener('click', function(e) {
		if (e.target !== categoryButton && !categoryDiv.contains(e.target)) {
			categoryDiv.style.display = 'none';
		}
	});

	td2.appendChild(categoryButton);
	td2.appendChild(document.createElement('br'));
	td2.appendChild(categoryDiv);
	td2.appendChild(categorySpan);

	Util.prepend(table, tr);
})();