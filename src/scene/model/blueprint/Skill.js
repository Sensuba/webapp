import Bloc from './Bloc.js';
import Types from './Types.js';

export default class Skill extends Bloc {

	constructor (src, ctx, target) {

		super("skill", src, ctx, true);
		this.f = (src, ins) => [this, this.chosen, this.chosen];
		this.types = [Types.bool, Types.int, Types.columnfilter, Types.cardfilter];
		this.target = target;
		this.trigger = (src, image) => this.execute({src, image});
	}

	setup (owner, image) {

		var columnfilter = this.in[2](), cardfilter = this.in[3]();

		let skill = {mana: this.in[1](), event: target => {
			this.chosen = target;
			this.trigger(owner, image);
		}};

		if (cardfilter) {
			skill.targetType = "card";
			skill.targetFunction = target => {
				if (target.hasState('exalted'))
					return false;
				if (this.src.player !== target.player && target.hasState('hidden'))
					return false;
				return this.in[3]()(owner, target);
			}
		} else if (columnfilter) {
			skill.targetType = "column";
			skill.targetFunction = target => this.in[2]()(owner, target);
		}

		owner.skills[this.in[0]() ? 1 : 0].push(skill);
	}
}