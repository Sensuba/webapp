import Location from './Location.js';

export default class Court extends Location {

	layer = 3;

	constructor (player) {

		super(player, "court");
		if(!arguments.length) return;
	}

	get opposite () { return this.player.opponent.court }
}