import Bloc from './Bloc.js';
import Types from './Types.js';

export default class Overload extends Bloc {

	constructor (src, ctx) {

		super("overload", src, ctx, true);
		this.f = (src, ins) => {
			ins[0].overload(ins[1]);
			return [];
		};
		this.types = [Types.card, Types.int];
	}
}