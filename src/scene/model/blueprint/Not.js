import Bloc from './Bloc.js';
import Types from './Types.js';

export default class Not extends Bloc {

	constructor (src, ctx) {

		super("opnot", src, ctx);
		this.f = (src, ins) => [!ins[0]];
		this.types = [Types.bool];
	}
}