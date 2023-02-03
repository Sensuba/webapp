import Bloc from './Bloc.js';
import Types from './Types.js';

export default class AddShield extends Bloc {

	constructor (src, ctx) {

		super("addshield", src, ctx, true);
		this.f = (src, ins) => {
			ins[0].setState("shield", true);
			return [];
		};
		this.types = [Types.card];
	}
}