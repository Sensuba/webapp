import Bloc from './Bloc.js';
import Types from './Types.js';

export default class Choosebox extends Bloc {

	constructor (src, ctx) {

		super("choosebox", src, ctx, true);
		this.f = (src, ins) => [this, this.item && this.item.type === "card" ? this.item.element : null, this.item && this.item.type === "model" ? this.item.element : null];
		this.types = [Types.int];
		this.out = [this, null, null];
		this.trigger = (src, image) => this.execute({src, image});
	}

	setup (owner, image) {

		let code = this.in[0] ? this.in[0]({src: this.src}) : 0;
		code = code || 0;
		owner.chooseboxtrigger = owner.chooseboxtrigger || {};
		owner.chooseboxtrigger[code] = item => {
			this.item = item;
			this.trigger(owner, image);
		};
		owner.innereffects = owner.innereffects || [];
		owner.innereffects.push(this);
	}
}