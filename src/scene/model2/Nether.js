var Location = require("./Location");

class Nether extends Location {

	constructor (player) {

		super(player, "nether");
		if(!arguments.length) return;
	}
}

module.exports = Nether;