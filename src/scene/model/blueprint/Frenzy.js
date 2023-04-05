import Bloc from './Bloc.js';
import Types from './Types.js';
import Listener from '../Listener.js';

export default class Frenzy extends Bloc {

	constructor (src, ctx) {

		super("frenzy", src, ctx, true);
		this.f = (src, ins) => [this, this.victim];
		this.types = [];
		this.out = [this, null];
		this.trigger = (src, image) => this.execute({src, image});
	}

	setup (owner, image) {

		owner.frenzy = owner.frenzy || [];
		owner.frenzy.push(victim => {
			this.victim = victim;
			owner.game.notify("frenzy.before", owner, victim);
			this.trigger(owner, image);
			owner.game.notify("frenzy", owner, victim);
		});
		owner.innereffects = owner.innereffects || [];
		owner.innereffects.push(this);
	}
}