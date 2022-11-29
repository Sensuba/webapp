import Bloc from './Bloc.js';
import Types from './Types.js';

export default class AddMana extends Bloc {

	constructor (src, ctx) {

		super("addmana", src, ctx, true);
		this.f = (src, ins) => {
			ins[1].addMana(ins[0]);
			return [];
		};
		this.types = [Types.int, Types.player];
	}
}