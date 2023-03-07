import Bloc from './Bloc.js';
import Types from './Types.js';

export default class CountCards extends Bloc {

	constructor (src, ctx) {

		super("countcards", src, ctx);
		this.f = (src, ins) => [ins[0].reduce((acc, e) => acc.concat(e.cards), []).filter(card => ins[1](src, card)).length];
		this.types = [Types.tiles, Types.cardfilter];
	}
}