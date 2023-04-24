import Bloc from './Bloc.js';
import Types from './Types.js';

export default class Destroy extends Bloc {

	constructor (src, ctx) {

		super("banish", src, ctx, true);
		this.f = (src, ins) => {
			ins[0].banish(true);
			return [];
		};
		this.types = [Types.card];
	}
}