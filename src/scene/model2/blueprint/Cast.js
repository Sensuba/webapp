var Bloc = require('./Bloc');
var Types = require('./Types');

class Cast extends Bloc {

	constructor (src, ctx, target) {

		super("cast", src, ctx, true);
		this.f = (src, ins) => [this, this.chosen];
		this.types = [Types.columnfilter, Types.cardfilter];
		this.target = target;
		this.trigger = (src, image) => this.execute({src, image});
	}

	setup (owner, image) {

		var columnfilter = this.in[0](), cardfilter = this.in[1]();

		if (cardfilter) {
			owner.targetType = "card";
			owner.targetFunction = target => this.in[1]()(owner, target);
		} else if (columnfilter) {
			owner.targetType = "column";
			owner.targetFunction = target => this.in[0]()(owner, target);
		}

		owner.events = owner.events || [];
		owner.events.push(target => {
			this.chosen = target;
			this.trigger(owner, image);
		});
	}
}

module.exports = Cast;