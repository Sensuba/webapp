import Bloc from './Bloc.js';
import Types from './Types.js';

export default class FindCard extends Bloc {

	constructor (src, ctx) {

		super("findcard", src, ctx);
		this.f = (src, ins) => {
			var items = ins[0].map(loc => loc.cards).reduce((acc, el) => acc.concat(el), []).filter(card => !ins[1] || ins[1](src, card));
			var item = items.length > 0 ? items[Math.floor(Math.random()*items.length)] : null;
			return [item, item !== null];
		};
		this.types = [Types.locations, Types.cardfilter];
	}
}