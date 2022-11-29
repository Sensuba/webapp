var Location = require("./Location");

class Court extends Location {

	layer = 3;

	constructor (player) {

		super(player, "court");
		if(!arguments.length) return;
	}

	get opposite () { return this.player.opponent.court }
}

module.exports = Court;