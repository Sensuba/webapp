var Bloc = require('./Bloc');
var Types = require('./Types');

class GenerateSummon extends Bloc {

	constructor (src, ctx) {

		super("generatesummon", src, ctx, true);
		var Card = require('../Card');
		this.f = (src, ins, props) => {
			var gen = null;
			if (!ins[1].isFull) {
				gen = new Card(src.game, ins[0]);
				gen.summon(ins[1]);
			}
			return [gen];
		};
		this.types = [Types.model, Types.location];
	}
}

module.exports = GenerateSummon;