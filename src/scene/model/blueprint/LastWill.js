import Bloc from './Bloc.js';
import Listener from '../Listener.js';

export default class LastWill extends Bloc {

	constructor (src, ctx) {

		super("lastwill", src, ctx, true);
		this.f = (src, ins) => [this];
		this.types = [];
		this.out = [this];
		this.trigger = (src, image) => this.execute({src, image, trigger: this});
	}

	setup (owner, image) {

		var that = this;
		var listener = new Listener(owner, own => that.src.game.subscribe("destroy.before", (type, data) => {
			if (data[0] === own) {
				that.trigger(own, image);
			}
		}));
		owner.passives.push(listener);
		owner.setState("lastwill", true)
		owner.innereffects = owner.innereffects || [];
		owner.innereffects.push(this);
	}
}