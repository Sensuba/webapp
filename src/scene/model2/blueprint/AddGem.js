var Bloc = require('./Bloc');
var Types = require('./Types');

class AddGem extends Bloc {

	constructor (src, ctx) {

		super("addgem", src, ctx, true);
		this.f = (src, ins) => {
			ins[1].addGems(ins[0]);
			return [];
		};
		this.types = [Types.int, Types.player];
	}
}

module.exports = AddGem;