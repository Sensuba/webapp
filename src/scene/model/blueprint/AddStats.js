import Bloc from './Bloc.js';
import Types from './Types.js';

export default class AddStats extends Bloc {

	constructor (src, ctx) {

		super("addstats", src, ctx, true);
		this.f = (src, ins) => {
			ins[0].addStats(ins[1], ins[2]);
			return [];
		};
		this.types = [Types.card, Types.int, Types.int];
	}
}