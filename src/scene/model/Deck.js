var Location = require("./Location");
var Card = require("./Card");
var Library = require("../utility/Library");

class Deck extends Location {

	layer = 1;

	constructor (player) {

		super(player, "deck");
		if(!arguments.length) return;
	}

	get opposite () { return this.player.opponent.deck }

	init (list) {

		this.starting = [];
		list.forEach(id => this.starting.push(Library.getCard(id)));
		this.starting.forEach(model => this.addCard(new Card(this.game, model)));
		this.shuffle();
	}

	shuffle() {

	    for (let i = this.cards.length - 1; i > 0; i--) {
	        const j = Math.floor(Math.random() * (i + 1));
	        [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
	    }
	}

	draw(filter) {

		if (this.cards.length <= 0)
			return;

		let card = filter ? this.cards.find(filter) : this.cards[0];
		if (card) {
			this.removeCard(card);
			this.game.notify("draw", card, this);
		}
		return card;
	}
}

module.exports = Deck;