var Bloc = require('./Bloc');
var Types = require('./Types');

class Freeze extends Bloc {

	constructor (src, ctx) {

		super("freeze", src, ctx, true);
		this.f = (src, ins) => {console.log(ins);
			ins[0].setState("freeze", true);
			return [];
		};
		this.types = [Types.card];
	}
}

module.exports = Freeze;