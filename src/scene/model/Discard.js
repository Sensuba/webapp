import Location from './Location.js';

export default class Discard extends Location {

	layer = 4;

	constructor (player) {

		super(player, "discard");
		if(!arguments.length) return;
	}

	get opposite () { return this.player.opponent.discard }
}