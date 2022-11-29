import Location from './Location.js';

export default class Graveyard extends Location {

	layer = 4;

	constructor (player) {

		super(player, "graveyard");
		if(!arguments.length) return;
	}

	get opposite () { return this.player.opponent.graveyard }
}