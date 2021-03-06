var Bloc = require('./Bloc');
var Types = require('./Types');

class FindRandomTile extends Bloc {

	constructor (src, ctx) {

		super("findtile", src, ctx);
		this.f = (src, ins) => {
			var items = ins[0].filter(tile => !ins[1] || ins[1](src, tile));
			var item = items.length > 0 ? items[Math.floor(Math.random()*items.length)] : null;
			return [item, item !== null];
		};
		this.types = [Types.locations, Types.tilefilter];
	}
}

module.exports = FindRandomTile;