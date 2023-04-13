import Location from './Location.js';
import Card from './Card.js';
import Library from '../utility/Library.js';

export default class Deck extends Location {

	layer = 1;
	curseLevel = 1;

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

	addCard (card) {

		if (this.hasCard(card))
			return;
		this.cards.splice(Math.floor(Math.random() * (this.count+1)), 0, card);
		if (card.location !== this)
			card.goto(this);
	}

	curse () {

		this.game.notify("curse.before", this, this.curseLevel);
		this.player.hero.damage(this.curseLevel);
		this.curseLevel++;
		this.game.notify("curse.before", this, this.curseLevel-1);
	}

	draw(filter) {

		if (this.cards.length <= 0) {
			if (!filter)
				this.curse();
			return;
		}

		let card = filter ? this.cards.find(filter) : this.cards[0];
		
		return card;
	}
}