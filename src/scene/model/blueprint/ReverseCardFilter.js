import Bloc from './Bloc.js';
import Types from './Types.js';

export default class ReverseCardFilter extends Bloc {

	constructor (src, ctx) {

		super("revcfilter", src, ctx);
		this.f = (src, ins) => [(src, target) => !ins[0](src, target)];
		this.types = [Types.cardfilter];
	}
}