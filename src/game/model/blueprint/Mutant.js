var Bloc = require('./Bloc');

class Mutant extends Bloc {

	constructor (src, ctx) {

		super("mutant", src, ctx);
		this.f = (src, ins, props) => [props.mutant];
		this.types = [];
	}
}

module.exports = Mutant;