var Bloc = require('./Bloc');
var Types = require('./Types');

class Target extends Bloc {

	constructor (src, ctx) {

		super("target", src, ctx);
		this.f = (src, ins) => [ins[0].target];
		this.types = [Types.card];
	}
}

module.exports = Target;