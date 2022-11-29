var Bloc = require('./Bloc');
var Types = require('./Types');

class Hand extends Bloc {

	constructor (src, ctx) {

		super("hand", src, ctx);
		this.f = (src, ins) => [ins[0].hand.count];
		this.types = [Types.player];
	}
}

module.exports = Hand;