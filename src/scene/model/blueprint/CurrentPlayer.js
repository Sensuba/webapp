var Bloc = require('./Bloc');

class CurrentPlayer extends Bloc {

	constructor (src, ctx) {

		super("current", src, ctx);
		this.f = (src, ins) => [ src.game.turnPlayer ];
		this.types = [];
	}
}

module.exports = CurrentPlayer;