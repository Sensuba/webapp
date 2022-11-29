import Bloc from './Bloc.js';
import Types from './Types.js';

export default class Freeze extends Bloc {

	constructor (src, ctx) {

		super("freeze", src, ctx, true);
		this.f = (src, ins) => {
			ins[0].setState("freeze", true);
			return [];
		};
		this.types = [Types.card];
	}
}