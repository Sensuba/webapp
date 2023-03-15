import Bloc from './Bloc.js';
import Types from './Types.js';

export default class Barrier extends Bloc {

	constructor (src, ctx) {

		super("barrier", src, ctx);
		this.f = (src, ins) => [this, x => { x.barrier = (x.barrier || 0) + ins[0]; return x; }];
		this.types = [Types.int];
	}

	setup () {

		var cpt = this.computeIn();
		this.src.barrier = (this.src.barrier || 0) + cpt[0];
	}
}