import Bloc from './Bloc.js';
import Types from './Types.js';

export default class Div extends Bloc {

	constructor (src, ctx) {

		super("opdiv", src, ctx);
		this.f = (src, ins) => [Math.floor(ins[0] / ins[1])];
		this.types = [Types.int, Types.int];
	}
}