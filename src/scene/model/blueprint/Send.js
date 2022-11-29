var Bloc = require('./Bloc');
var Types = require('./Types');

class Send extends Bloc {

	constructor (src, ctx) {

		super("send", src, ctx, true);
		this.f = (src, ins) => {
			let card = ins[0].sendTo(ins[1]);
			return [card];
		}
		this.types = [Types.card, Types.location];
	}
}

module.exports = Send;