import Bloc from './Bloc.js';
import Types from './Types.js';

export default class AddGem extends Bloc {

	constructor (src, ctx) {

		super("addgem", src, ctx, true);
		this.f = (src, ins) => {
			ins[1].addGems(ins[0]);
			return [];
		};
		this.types = [Types.int, Types.player];
	}
}