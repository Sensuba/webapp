import Bloc from './Bloc.js';
import Types from './Types.js';

export default class RefillMana extends Bloc {

	constructor (src, ctx) {

		super("refillmana", src, ctx, true);
		this.f = (src, ins) => {
			if (ins[1] > 0 && ins[0].mana < ins[0].receptacles)
				ins[0].addMana(Math.min(ins[0].receptacles - ins[0].mana, ins[1]));
			return [];
		};
		this.types = [Types.player, Types.int];
	}
}