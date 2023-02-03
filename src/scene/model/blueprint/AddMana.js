import Bloc from './Bloc.js';
import Types from './Types.js';

export default class AddMana extends Bloc {

	constructor (src, ctx) {

		super("addmana", src, ctx, true);
		this.f = (src, ins) => {
			ins[0].addMana(ins[1]);
			return [];
		};
		this.types = [Types.player, Types.int];
	}
}