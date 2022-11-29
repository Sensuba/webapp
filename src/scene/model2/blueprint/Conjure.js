var Bloc = require('./Bloc');
var Types = require('./Types');

class Conjure extends Bloc {

	constructor (src, ctx) {

		super("conjure", src, ctx, true);
		var Card = require('../Card');
		this.f = (src, ins, props) => {
			var gen;
			var n = ins[1] === null ? 1 : ins[1];
			for (var i = 0; i < n && !src.player.hand.isFull; i++) {
				gen = new Card(src.game, ins[0]);
				src.player.hand.addCard(gen);
				this.out = [gen];
				if (this["for each"])
					this["for each"].execute(props);
			}
			this.out = null;
			if (this.completed)
				this.completed.execute(props);
			return;
		};
		this.types = [Types.model, Types.int];
		this.toPrepare.push("for each");
		this.toPrepare.push("completed");
	}
}

module.exports = Conjure;