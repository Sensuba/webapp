
let cards = JSON.parse(localStorage.getItem('library.cards'));
let terrains = JSON.parse(localStorage.getItem('library.terrains'));
let heroes = JSON.parse(localStorage.getItem('library.heroes'));
let portals = JSON.parse(localStorage.getItem('library.portals'));

let cardsversion = localStorage.getItem('library.cards.version');
let terrainsversion = localStorage.getItem('library.terrains.version');
let heroesversion = localStorage.getItem('library.heroes.version');
let portalsversion = localStorage.getItem('library.portals.version');

export default class Library {

	static get cards () {
		
		if (localStorage.getItem('library.cards.version') !== cardsversion) {
			cards = JSON.parse(localStorage.getItem('library.cards'));
			cardsversion = localStorage.getItem('library.cards.version');
		}
		return cards;
	}

	static get heroes () {
		
		if (localStorage.getItem('library.heroes.version') !== heroesversion) {
			heroes = JSON.parse(localStorage.getItem('library.heroes'));
			heroesversion = localStorage.getItem('library.heroes.version');
		}
		return heroes;
	}

	static get portals () {
		
		if (localStorage.getItem('library.portals.version') !== portalsversion) {
			portals = JSON.parse(localStorage.getItem('library.portals'));
			portalsversion = localStorage.getItem('library.portals.version');
		}
		return portals;
	}

	static getCard(key) {

		if (localStorage.getItem('library.cards.version') !== cardsversion) {
			cards = JSON.parse(localStorage.getItem('library.cards'));
			cardsversion = localStorage.getItem('library.cards.version');
		}
		return cards[key];
	}

	static getTerrain(key) {

		if (localStorage.getItem('library.terrains.version') !== terrainsversion) {
			terrains = JSON.parse(localStorage.getItem('library.terrains'));
			terrainsversion = localStorage.getItem('library.terrains.version');
		}
		return terrains[key];
	}

	static getHero(key) {

		if (localStorage.getItem('library.heroes.version') !== heroesversion) {
			heroes = JSON.parse(localStorage.getItem('library.heroes'));
			heroesversion = localStorage.getItem('library.heroes.version');
		}
		return heroes[key];
	}

	static getPortal(key) {

		if (localStorage.getItem('library.portals.version') !== portalsversion) {
			portals = JSON.parse(localStorage.getItem('library.portals'));
			portalsversion = localStorage.getItem('library.portals.version');
		}
		return portals[key];
	}
}