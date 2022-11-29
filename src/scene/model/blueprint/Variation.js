import Bloc from './Bloc.js';
import Types from './Types.js';

export default class Variation extends Bloc {

	constructor (src, ctx) {

		super("variation", src, ctx);
		this.f = (src, ins) => [ x => {
			if (ins[0] && x.location && x.location.layer <= 2)
				x.mana = Math.max(0, x.mana + ins[0]);
			if (ins[1])
				x.atk = Math.max(0, x.atk + ins[1]);
			if (ins[2])
				x.hp = Math.max(0, x.hp + ins[2]);
			return x;
		}];
		this.types = [Types.int, Types.int, Types.int, Types.int];
	}
}