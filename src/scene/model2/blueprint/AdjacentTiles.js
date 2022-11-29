var Bloc = require('./Bloc');
var Types = require('./Types');

class AdjacentTiles extends Bloc {

	constructor (src, ctx) {

		super("adjacenttiles", src, ctx);
		this.f = (src, ins) => [ins[0].adjacents, ins[0].left, ins[0].right];
		this.types = [Types.location];
	}
}

module.exports = AdjacentTiles;