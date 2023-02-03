import Bloc from './Bloc.js';
import Types from './Types.js';

export default class Copy extends Bloc {

	constructor (src, ctx) {

		super("transform", src, ctx, true);
		this.f = (src, ins) => {
			let transform = ins[0].transform(ins[1]);
			return [transform];
		};
		this.types = [Types.card, Types.model];
	}
}