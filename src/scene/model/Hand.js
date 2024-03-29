import Location from './Location.js';

const MAX_HAND_SIZE = 10;

export default class Hand extends Location {

	layer = 2;

	maxsize = MAX_HAND_SIZE;

	constructor (player) {

		super(player, "hand");
		if(!arguments.length) return;
	}

	get opposite () { return this.player.opponent.hand }
}