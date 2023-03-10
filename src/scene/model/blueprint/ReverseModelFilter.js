import Bloc from './Bloc.js';
import Types from './Types.js';

export default class ReverseModelFilter extends Bloc {

	constructor (src, ctx) {

		super("revmfilter", src, ctx);
		this.f = (src, ins) => [target => !ins[0](target)];
		this.types = [Types.modelfilter];
	}
}