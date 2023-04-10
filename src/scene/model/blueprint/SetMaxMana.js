import Bloc from './Bloc.js';
import Types from './Types.js';

export default class SetMaxMana extends Bloc {

	constructor (src, ctx) {

		super("setmaxmana", src, ctx, true);
		this.f = (src, ins) => {
			ins[0].setMaxReceptacles(ins[1]);
			return [];
		};
		this.types = [Types.player, Types.int];
	}
}