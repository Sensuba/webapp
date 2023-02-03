import Bloc from './Bloc.js';
import Types from './Types.js';
import Library from '../../utility/Library.js';

export default class FindModel extends Bloc {

	constructor (src, ctx) {

		super("findmodel", src, ctx);
		this.f = (src, ins) => {
			var list = Library.cards;
			var items = Object.keys(list).map(k => list[k]).filter(card => ins[0](src, card));
			var item = items.length > 0 ? items[Math.floor(Math.random()*items.length)] : null;
			return [item, item !== null];
		};
		this.types = [Types.modelfilter];
	}
}