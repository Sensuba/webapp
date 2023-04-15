import Bloc from './Bloc.js';
import Types from './Types.js';

export default class ChangeDamage extends Bloc {

	constructor (src, ctx) {

		super("changedamage", src, ctx, true);
		this.f = (src, ins) => {
			ins[0].dmgModifier = ins[1];
			return [];
		};
		this.types = [Types.card, Types.int];
	}
}