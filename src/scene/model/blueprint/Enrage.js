var Bloc = require('./Bloc');
var Types = require('./Types');
//var Mutation = require("../Mutation");

class Enrage extends Bloc {

	constructor (src, ctx) {

		super("enrage", src, ctx, true);
		this.f = (src, ins) => {

			if (!ins[0])
				return [];
			if (!ins[0].isUnit || !ins[0].onField || ins[0].dmg >= ins[0].eff.hp)
				return [];
			let target = ins[0].findAttackTarget();
			if (!target || target.isHero)
				return [];
			/*if (ins[1]) {
				var mut = new Mutation(ins[1]);
				mut.attach(ins[0]);
				ins[0].update();
				ins[0].attack();
				mut.detach();
				ins[0].update();
			} else*/
				ins[0].attack();
			return [target];
		}
		this.types = [Types.card, Types.mutation];
	}
}

module.exports = Enrage;