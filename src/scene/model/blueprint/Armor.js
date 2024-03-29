import Bloc from './Bloc.js';
import Types from './Types.js';

export default class Armor extends Bloc {

	constructor (src, ctx) {

		super("armor", src, ctx);
		this.f = (src, ins) => [this, x => { x.armor = (x.armor || 0) + ins[0]; return x; }];
		this.types = [Types.int];
	}

	setup () {

		var cpt = this.computeIn();
		this.src.armor = (this.src.armor || 0) + cpt[0];
	}
}