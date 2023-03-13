import Bloc from './Bloc.js';
import Types from './Types.js';

export default class Data extends Bloc {

	constructor (name, src, ctx, d) {

		super(name, src, ctx);
		this.f = (src, ins, props) => d(ins[0]);
		this.types = [Types.data];
	}
}