var Bloc = require('./Bloc');
var Types = require('./Types');

class AddStats extends Bloc {

	constructor (src, ctx) {

		super("addstats", src, ctx, true);
		this.f = (src, ins) => {
			ins[0].addStats(ins[1], ins[2]);
			return [];
		};
		this.types = [Types.card, Types.int, Types.int];
	}
}

module.exports = AddStats;