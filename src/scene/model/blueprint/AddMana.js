var Bloc = require('./Bloc');
var Types = require('./Types');

class AddMana extends Bloc {

	constructor (src, ctx) {

		super("addmana", src, ctx, true);
		this.f = (src, ins) => {
			ins[1].addMana(ins[0]);
			return [];
		};
		this.types = [Types.int, Types.player];
	}
}

module.exports = AddMana;