import Bloc from './Bloc.js';
import Types from './Types.js';

export default class Category extends Bloc {

	constructor (src, ctx) {

		super("category", src, ctx);
		this.f = (src, ins) => [(src, card) => card.hasCategory(ins[0]), model => model.categories && model.categories.includes(ins[0])];
		this.types = [Types.string];
	}
}