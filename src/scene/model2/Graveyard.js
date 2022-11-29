var Location = require("./Location");

class Graveyard extends Location {

	layer = 4;

	constructor (player) {

		super(player, "graveyard");
		if(!arguments.length) return;
	}

	get opposite () { return this.player.opponent.graveyard }
}

module.exports = Graveyard;