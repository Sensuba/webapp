import Location from './Location.js';

export default class Capsule extends Location {

	constructor (player) {

		super(player, "capsule");
		if(!arguments.length) return;
	}
}