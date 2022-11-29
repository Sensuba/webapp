var Bloc = require('./Bloc');
var Types = require('./Types');

class Booster extends Bloc {

	constructor (src, ctx) {

		super("booster", src, ctx);
		this.f = (src, ins) => [ x => {
			x.booster = x.booster || {};
			x.booster[ins[1]] = (x.booster[ins[1]] || 0) + ins[0];
			return x;
		}];
		this.types = [Types.int, Types.booster];
	}
}

module.exports = Booster;