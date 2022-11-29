var Bloc = require('./Bloc');
var Types = require('./Types');
var Library = require("../../utility/Library");

class Model extends Bloc {

	constructor (src, ctx) {

		super("model", src, ctx);
		this.f = (src, ins) => [Library.getCard(ins[0])];
		this.types = [Types.int];
	}
}

module.exports = Model;