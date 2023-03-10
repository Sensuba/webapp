import Bloc from './Bloc.js';
import Types from './Types.js';

export default class ExtraTrigger extends Bloc {

	constructor (src, ctx) {

		super("extratrigger", src, ctx, true);
		this.f = (src, ins) => {
			if (ins[1] <= 0)
				return [];
			ins[0].extratriggers = (ins[0].extratriggers || 0) + ins[1];
			return [];
		};
		this.types = [Types.card, Types.int];
	}
}