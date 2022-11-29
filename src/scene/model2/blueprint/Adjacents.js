var Bloc = require('./Bloc');
var Types = require('./Types');

class Adjacents extends Bloc {

	constructor (src, ctx) {

		super("adjacents", src, ctx);
		this.f = (src, ins) => [ins[0].adjacents];
		this.types = [Types.tile];
	}
}

module.exports = Adjacents;