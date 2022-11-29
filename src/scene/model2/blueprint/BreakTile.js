var Bloc = require('./Bloc');
var Types = require('./Types');

class BreakCard extends Bloc {

	constructor (src, ctx) {

		super("brkcard", src, ctx);
		this.f = (src, ins) => [ins[0].x, ins[0].player, ins[0].count, ins[0].frontUnit, ins[0].backUnit];
		this.types = [Types.card];
	}
}

module.exports = BreakCard;