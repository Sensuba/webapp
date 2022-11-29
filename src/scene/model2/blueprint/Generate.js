var Bloc = require('./Bloc');
var Types = require('./Types');

class Generate extends Bloc {

	constructor (src, ctx) {

		super("generate", src, ctx, true);
		var Card = require('../Card');
		this.f = (src, ins, props) => {
			var n = ins[1] === null ? 1 : ins[1];
			for (var i = 0; i < n; i++) {
				let gen = new Card(src.game, ins[0]);
				ins[2].addCard(gen);
				this.out = [gen, i];
				if (this["for each"])
					this["for each"].execute(props);
			}
			this.out = null;
			if (this.completed)
				this.completed.execute(props);
			return;
		};
		this.types = [Types.model, Types.int, Types.location];
		this.toPrepare.push("for each");
		this.toPrepare.push("completed");
	}
}

module.exports = Generate;