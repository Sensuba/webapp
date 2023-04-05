import Bloc from './Bloc.js';
import Types from './Types.js';

export default class BreakShield extends Bloc {

	constructor (src, ctx) {

		super("breakshield", src, ctx, true);
		this.f = (src, ins) => {
			ins[0].breakShield();
			return [];
		};
		this.types = [Types.card];
	}
}