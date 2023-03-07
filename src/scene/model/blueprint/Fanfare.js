import Bloc from './Bloc.js';
import Types from './Types.js';

export default class Fanfare extends Bloc {

	constructor (src, ctx, target) {

		super("fanfare", src, ctx, true);
		this.f = (src, ins) => [this, this.chosen, this.chosen];
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
			owner.game.notify("fanfare.before", owner, target);
			this.trigger(owner, image);
			owner.game.notify("fanfare", owner, target);
		});
		owner.innereffects = owner.innereffects || [];
		owner.innereffects.push(this);
	}
}