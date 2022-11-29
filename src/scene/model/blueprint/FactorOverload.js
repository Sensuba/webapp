var Bloc = require('./Bloc');
var Types = require('./Types');

class FactorOverload extends Bloc {

	constructor (src, ctx) {

		super("factor", src, ctx);
		this.f = (src, ins) => [Math.floor(ins[0] * (1 + (src.overload || 0)/100))];
		this.types = [Types.int];
	}
}

module.exports = FactorOverload;