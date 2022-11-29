import Location from './Location.js';

export default class Nether extends Location {

	constructor (player) {

		super(player, "nether");
		if(!arguments.length) return;
	}
}