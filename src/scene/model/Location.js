
export default class Location {

	cards = [];

	constructor (owner, type) {

		if(!owner) return;

		if (owner.id.type === "game") {
			this.game = owner;
		} else {
			this.player = owner;
			this.game = this.player.game;
		}
		this.game.register(this, type);
	}

	get isFull() {

		return this.maxsize && this.count >= this.maxsize;
	}

	addCardWhenFull (card) {

		card.banish();
	}

	addCard (card) {

		if (this.hasCard(card))
			return;
		if (this.isFull) {
			this.addCardWhenFull(card);
			return;
		}
		this.cards.push(card);
		if (card.location !== this)
			card.goto(this);
	}

	removeCard (card) {

		if (this.cards.includes (card)) {
			this.cards = this.cards.filter (el => el !== card);
			if (card !== null && card.location === this)
				card.goto(null);
		}
	}

	hasCard (card) {

		return this.cards.includes (card);
	}

	get firstCard () {

		return this.isEmpty ? null : this.cards[0];
	}

	get lastCard () {

		return this.isEmpty ? null : this.cards[this.count-1];
	}

	get count () {

		return this.cards.length;
	}

	get isEmpty () {

		return this.count === 0;
	}

	serialize () {

		return {
			cards: this.cards.map(c => c.id.no)
		}
	}

	setup (game, data) {
		
		this.game = game;
		this.cards = data.cards.map(no => game.find({type: "card", no}));
		this.cards.forEach(c => c.location = this);
	}
}