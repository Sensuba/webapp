import Location from './Location.js';

export default class Throne extends Location {

	layer = 3;

	constructor (player) {

		super(player, "throne");
		if(!arguments.length) return;
	}

	get opposite () { return this.player.opponent.throne }

	get hero () { return this.cards[0] }

	serialize () {

		return {
			hero: this.hero.id.no
		}
	}

	setup (game, data) {
		
		this.game = game;
		this.cards.push(game.find({type: "hero", no: data.hero}));
		this.hero.location = this;
	}
}