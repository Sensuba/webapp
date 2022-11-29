var Bloc = require('./Bloc');
var Types = require('./Types');

class FilterDamaged extends Bloc {

	constructor (src, ctx) {

		super("filterdamaged", src, ctx);
		this.f = (src, ins) => [(src, target) => (!ins[0] || ins[0] <= 0 || (target.dmg && target.dmg >= ins[0])) && (!ins[1] || !target.dmg || target.dmg <= ins[1])];
		this.types = [Types.int, Types.int];
	}
}

module.exports = FilterDamaged;