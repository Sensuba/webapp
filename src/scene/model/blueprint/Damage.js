import Bloc from './Bloc.js';
import Types from './Types.js';

export default class Damage extends Bloc {

	constructor (src, ctx) {

		super("damage", src, ctx, true);
		this.f = (src, ins) => {
			let damage = ins[0].damage(ins[2], ins[1]);
			return [damage.damage, damage.kill, damage.overkill];
		};
		this.types = [Types.card, Types.card, Types.int];
	}
}