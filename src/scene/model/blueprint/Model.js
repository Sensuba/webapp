import Bloc from './Bloc.js';
import Types from './Types.js';
import Library from '../../utility/Library.js';

export default class Model extends Bloc {

	constructor (src, ctx) {

		super("model", src, ctx);
		this.f = (src, ins) => [Library.getCard(ins[0])];
		this.types = [Types.int];
	}
}