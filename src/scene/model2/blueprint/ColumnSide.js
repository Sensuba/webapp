var Bloc = require('./Bloc');
var Types = require('./Types');

class ColumnSide extends Bloc {

	constructor (src, ctx) {

		super("columnside", src, ctx);
		this.f = (src, ins) => [ins[1].tiles[ins[0]]];
		this.types = [Types.column, Types.player];
	}
}

module.exports = ColumnSide;