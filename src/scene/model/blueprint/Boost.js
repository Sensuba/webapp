var Bloc = require('./Bloc');
var Types = require('./Types');

class Boost extends Bloc {

	constructor (src, ctx) {

		super("boost", src, ctx);
		this.f = (src, ins) => [(src.eff.booster && src.eff.booster[ins[0]] ? src.eff.booster[ins[0]] : 0) + (ins[0] === "damage" && src.boost ? src.boost : 0)];
		this.types = [Types.booster];
	}
}

module.exports = Boost;