import Bloc from './Bloc.js';
import Types from './Types.js';

export default class Autocast extends Bloc {

	constructor (src, ctx) {

		super("autocast", src, ctx, true);
		this.f = (src, ins) => {
			let result = ins[0].autocast(ins[1]);
			return [result];
		};
		this.types = [Types.card, Types.player];
	}
}