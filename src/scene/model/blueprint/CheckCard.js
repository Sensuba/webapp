import Bloc from './Bloc.js';
import Types from './Types.js';

export default class CheckCard extends Bloc {

	constructor (src, ctx) {

		super("checkcard", src, ctx);
		this.f = (src, ins) => [!ins[1] || ins[1](src, ins[0]), ins[0] !== null && ins[0] !== undefined];
		this.types = [Types.card, Types.cardfilter];
	}
}