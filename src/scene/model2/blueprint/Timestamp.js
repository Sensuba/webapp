var Bloc = require('./Bloc');
var Types = require('./Types');
var Event = require('./Event');

class Timestamp extends Bloc {

	constructor (src, ctx) {

		super("timestamp", src, ctx);
		this.f = (src, ins) => [ new Event(src, ins[1], (t,d) => !ins[0] || ins[0].playing) ];
		this.types = [Types.player, Types.timestamp];
	}
}

module.exports = Timestamp;