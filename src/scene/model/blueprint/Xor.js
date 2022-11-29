import Bloc from './Bloc.js';
import Types from './Types.js';

export default class Xor extends Bloc {

	constructor (src, ctx) {

		super("opxor", src, ctx);
		this.f = (src, ins) => [ins[0] !== ins[1]];
		this.types = [Types.bool, Types.bool];
	}
}