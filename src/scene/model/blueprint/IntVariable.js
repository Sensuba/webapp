import Bloc from './Bloc.js';
import Types from './Types.js';

export default class IntVariable extends Bloc {

	constructor (src, ctx) {

		super("intvar", src, ctx);
		this.f = (src, ins) => [(ins[1] || src).getVariable(ins[0]), (ins[1] || src).getVariable(ins[0]) !== undefined];
		this.types = [Types.string, Types.card];
	}
}