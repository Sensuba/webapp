var Bloc = require('./Bloc');
var Types = require('./Types');

class Category extends Bloc {

	constructor (src, ctx) {

		super("category", src, ctx);
		this.f = (src, ins) => [(src, card) => card.hasCategory(ins[0]), model => model.categories && model.categories.includes(ins[0])];
		this.types = [Types.string];
	}
}

module.exports = Category;