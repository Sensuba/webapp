var Bloc = require('./Bloc');
var Types = require('./Types');

class SetStats extends Bloc {

	constructor (src, ctx) {

		super("setstats", src, ctx, true);
		this.f = (src, ins) => {
			ins[0].setStats(ins[1], ins[2], ins[3]);
			return [];
		};
		this.types = [Types.card, Types.int, Types.int, Types.int];
	}
}

module.exports = SetStats;