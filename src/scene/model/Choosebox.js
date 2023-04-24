import Library from '../utility/Library.js';

export default class Choosebox {

	items = [];
	isOpen = false;
	queue = [];

	constructor (player) {

		if(!player) return;

		this.player = player;
		this.game = this.player.game;
		this.game.register(this, "choosebox");
	}

	addItem (element, type) {

		if (this.isOpen) {
			if (this.queue.length <= 0 || this.queue[this.queue.length-1].srccode)
				this.queue.push({items: [{element, type}]});
			else this.queue[this.queue.length-1].items.push({element, type});
		}
		else {
			this.items.push({element, type});
			this.game.notify("addchoosebox", this, element, type);
		}
	}

	clear () {

		this.items = [];
		this.game.notify("clearchoosebox", this);
	}

	open (srccode, clear) {

		if (this.isOpen) {
			if (this.queue.length <= 0 || this.queue[this.queue.length-1].srccode)
				return;
			this.queue[this.queue.length-1].toClear = clear;
			this.queue[this.queue.length-1].srccode = srccode;
		} else {
			if (this.items.length <= 0)
				return;
			this.game.phase = "choose";
			this.isOpen = true;
			this.toClear = clear;
			this.srccode = srccode;
			this.game.notify("openchoosebox", this);
		}
	}

	choose (no) {

		if (!this.isOpen || no >= this.count)
			return;
		this.isOpen = false;
		let items = this.items;
		if (this.toClear) {
			this.clear();
			delete this.toClear;
		}
		this.game.phase = "waiting";
		this.game.notify("closechoosebox", this);
		if (this.srccode && this.srccode.src.chooseboxtrigger && this.srccode.src.chooseboxtrigger[this.srccode.code])
			this.srccode.src.chooseboxtrigger[this.srccode.code](items[no]);

		if (this.queue.length > 0) {
			let e = this.queue.shift();
			e.items.forEach(i => this.addItem(i.element, i.type));
			if (e.srccode)
				this.open(e.srccode, e.toClear);
		}
		else this.game.phase = "main";
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
			isOpen: this.isOpen,
			toClear: this.toClear,
			srccode: this.srccode ? { src: this.srccode.src.id, code: this.srccode.code } : this.srccode,
			queue: this.queue.map(e => { return {
				items: e.items.map(i => { return {element: i.type === "card" ? i.element.id.no : i.element.key, type: i.type} }),
				toClear: e.toClear,
				srccode: e.srccode ? { src: e.srccode.src.id, code: e.srccode.code } : e.srccode
			}})
		}
	}

	setup (game, data) {
		
		this.game = game;
		this.items = data.items.map(i => { return {element: i.type === "card" ? game.find({type: "card", no: i.element}) : Library.getCard(i.element), type: i.type} });
		this.isOpen = data.isOpen;
		this.toClear = data.toClear;
		this.srccode = data.srccode;
		if (this.srccode && this.srccode.src)
			this.srccode.src = game.find(this.srccode.src);
		this.queue = data.queue.map(e => { return {
			items: e.items.map(i => { return {element: i.type === "card" ? game.find({type: "card", no: i.element}) : Library.getCard(i.element), type: i.type} }),
			toClear: e.toClear,
			srccode: e.srccode ? { src: game.find(e.srccode.src), code: e.srccode.code } : e.srccode
		}})
	}
}