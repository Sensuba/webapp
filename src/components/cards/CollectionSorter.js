
import { read } from '../../TextManager';
import Library from '../../scene/utility/Library';

export default (() => {

	var normalize = text => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

	var valueSort = (attr, text = false) => (a, b) => {

		var va = text ? a[attr] : (a[attr] !== undefined && a[attr] !== null ? parseInt(a[attr], 10) : null);
		var vb = text ? b[attr] : (b[attr] !== undefined && b[attr] !== null ? parseInt(b[attr], 10) : null);
		if (va !== null && vb !== null)
			return va < vb ? -1 : (va > vb ? 1 : 0);
		if (va !== null && vb === null)
			return 1;
		if (va === null && vb !== null)
			return -1;
		return 0;
	}

	var nameSort = valueSort("name", true);

	var manaSort = valueSort("mana");

	var typeSort = (a, b) => {

		var typeToPrio = type => {

			switch (type) {
			case "unit": return 0;
			case "building": return 1;
			case "spell": return 2;
			default: return 99;
			}
		}

		return typeToPrio(a.type) - typeToPrio(b.type);
	}

	var colorToPrio = color => {

		switch (color) {
		case "white": return 1;
		case "red": return 2;
		case "blue": return 3;
		case "green": return 4;
		case "black": return 5;
		default: return 6;
		}
	}

	var colorSort = (a, b) => {

		if (a.colors && !b.colors)
			return -1;
		if (b.colors && !a.colors)
			return 1;
		if (a.colors && b.colors)
			return 10 * (colorToPrio(a.colors[0]) - colorToPrio(b.colors[0])) + (colorToPrio(a.colors[1]) - colorToPrio(b.colors[1]));
		return colorToPrio(a.color) - colorToPrio(b.color);
	}

	var sort = (cards, sf) => {

		var func = nameSort;
		switch (sf) {
		case "type": func = typeSort; break;
		case "name": func = nameSort; break;
		case "mana": func = manaSort; break;
		case "color": func = colorSort; break;
		default: break;
		}

		let newcards = cards.slice();

		newcards.sort((a, b) => {
			var r = func(a, b);
			if (r === 0) return nameSort(a, b);
			return r;
		});

		return newcards;
	}

	var opFilter = (attr, value, op) => {

		switch (op) {
		case "1": return card => card[attr] && parseInt(card[attr], 10) > value;
		case "2": return card => card[attr] && parseInt(card[attr], 10) >= value;
		case "3": return card => card[attr] && parseInt(card[attr], 10) === value;
		case "4": return card => !card[attr] || parseInt(card[attr], 10) !== value;
		case "5": return card => card[attr] && parseInt(card[attr], 10) <= value;
		case "6": return card => card[attr] && parseInt(card[attr], 10) < value;
		default: return card => true;
		}
	}

	var effectFilter = description => card => normalize(card.description).includes(normalize(description));

	var searchFilter = search => card => {

		if (normalize(card.name).includes(normalize(search)))
			return true;

		if (card.categories && card.categories.some(cat => normalize(read("cards/categories/" + cat) || "").includes(normalize(search))))
			return true;

		let effects = card.abilities ? card.abilities.map(a => a.effect) : [card.effect];

		let flag = false;
		effects.forEach(text => {

			let ntext = "";
			// eslint-disable-next-line
			let texts = text.split(/\[[^\[]+\]|\{[^\{]+\}|\n/);
			// eslint-disable-next-line
			let matches = text.match(/\[[^\[]+\]|\{[^\{]+\}|\n/g);
			if (matches)
				matches.forEach((match,i) => {
					let el = match.slice(1, -1);
					ntext += texts[i];
					if (match[0] === '{') {
						let slices = el.split('/');
						let key = slices[0];
						ntext += slices.length > 1 ? slices[1] : Library.cards[key].name;
					} else if (match[0] === '[') {
						ntext += read('keywords/' + el);
					} else if (match[0] === '\n') {
						ntext += "";
					}
				});
			ntext += texts[texts.length-1];

			if (normalize(ntext).includes(normalize(search))) 
				flag = true;
		});

		return flag;
	}

	var filter = (cards, f) => {

		if (f.collectable)
			cards = cards.filter(card => !card.token);
		if (f.type && f.type !== "")
			cards = cards.filter(card => card.type === f.type);
		if (f.search && f.search !== "") 
			cards = cards.filter(searchFilter(f.search));
		if (f.name && f.name !== "")
			cards = cards.filter(card => normalize(card.name).includes(normalize(f.name)));
		if (f.category && f.category !== "")
			cards = cards.filter(card => card.categories && card.categories.some(cat => normalize(read("cards/categories/" + cat)).includes(normalize(f.category))));
		if (f.effect && f.effect !== "")
			cards = cards.filter(effectFilter(f.effect));
		if (f.mana && !isNaN(f.mana) && f.manaop && f.manaop !== "")
			cards = cards.filter(opFilter("mana", parseInt(f.mana, 10), f.manaop));
		if (f.orderBy)
			cards = sort(cards, f.orderBy);
		return cards;
	}

	return {

		sort,
		filter
	};

})();