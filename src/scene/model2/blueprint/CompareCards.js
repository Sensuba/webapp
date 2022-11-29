var Bloc = require('./Bloc');
var Types = require('./Types');

class CompareCards extends Bloc {

	constructor (src, ctx) {

		super("cmpcards", src, ctx);
		this.f = (src, ins) => {
			if (!ins[0] || !ins[1])
				return [false, false, false];
			return [ins[0].id === ins[1].id, ins[0].type === ins[1].type, ins[0].player && ins[1].player && ins[0].player.id === ins[1].player.id];
		}
		this.types = [Types.card, Types.card];
	}
}

module.exports = CompareCards;