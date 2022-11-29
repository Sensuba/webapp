import Bloc from './Bloc.js';
import Types from './Types.js';

export default class Hand extends Bloc {

	constructor (src, ctx) {

		super("hand", src, ctx);
		this.f = (src, ins) => [ins[0].hand.count];
		this.types = [Types.player];
	}
}