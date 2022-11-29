import Bloc from './Bloc.js';
import Types from './Types.js';

export default class Max extends Bloc {

	constructor (src, ctx) {

		super("opmax", src, ctx);
		this.f = (src, ins) => [Math.max(ins[0], ins[1])];
		this.types = [Types.int, Types.int];
	}
}