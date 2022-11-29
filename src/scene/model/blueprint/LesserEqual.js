import Bloc from './Bloc.js';
import Types from './Types.js';

export default class LesserEqual extends Bloc {

	constructor (src, ctx) {

		super("ople", src, ctx);
		this.f = (src, ins) => [ins[0] <= ins[1]];
		this.types = [Types.int, Types.int];
	}
}