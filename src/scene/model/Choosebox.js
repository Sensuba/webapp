import Library from '../utility/Library.js';

export default class Choosebox {

	items = [];
	isOpen = false;

	constructor (player) {

		if(!player) return;

		this.player = player;
		this.game = this.player.game;
		this.game.register(this, "choosebox");
	}

	addItem (element, type) {

		this.items.push({element, type});
	}

	clear () {

		this.items = [];
	}

	open (callback) {

		this.game.notify("openchoosebox.before", this);
		this.isOpen = true;
		this.callback = callback;
		this.game.notify("openchoosebox", this);
	}

	choose (no) {

		if (!this.isOpen || no < this.count)
			return;
		this.isOpen = false;
		if (this.callback)
			this.callback(this.items[no].element);
	}

	chooseAtRandom () {

		this.choose(Math.floor(Math.random()*this.count));
	}

	get count () {

		return this.items.length;
	}

	get isEmpty () {

		return this.count === 0;
	}

	serialize () {

		return {
			items: this.items.map(i => { return {element: i.type === "card" ? i.element.id.no : i.element.key, type: i.type} }),
			isOpen: this.isOpen
		}
	}

	setup (game, data) {
		
		this.game = game;
		this.items = data.items.map(i => { return {element: i.type === "card" ? game.find({type: "card", no: i.element}) : Library.getCard(i.element), type: i.type} });
		this.isOpen = data.isOpen;
	}
}