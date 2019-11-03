var Bloc = require('./Bloc');
var Types = require('./Types');
var Aspect = require('../board/Aspect');

class MutateNextCard extends Bloc {

	constructor (src, ctx) {

		super("mutnext", src, ctx, true);
		this.f = (src, ins) => {
			var aspect = new Aspect(ins[2], x => this.in[1](this.src, x)(x), [ins[2].hand], ins[0]);
			var unsub1, unsub2;
			unsub1 = ins[3].subscribe((t,s,d) => {
				aspect.deactivate();
				unsub1();
				unsub2();
			});
			unsub2 = src.gameboard.subscribe("playcard", (t,s,d) => {
				if (aspect.applicable(s)) {
					aspect.deactivate();
					unsub1();
					unsub2();
				}
			});
			return [];
		};
		this.types = [Types.cardfilter, Types.mutation, Types.area, Types.event];

		if (!src.mutdata)
			src.mutdata = [];
		src.mutdata.push(this);
		this.mutno = src.mutdata.length-1;
	}

	getMutation () {

		return {effect: this.in[1](this.src), targets: this.in[0](this.src), end: this.in[3](this.src)};
	}
}

module.exports = MutateNextCard;