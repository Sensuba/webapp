import Bloc from './Bloc.js';
import Types from './Types.js';
import EListener from '../Listener.js';

export default class HandListener extends Bloc {

	constructor (src, ctx) {

		super("handlistener", src, ctx, true);
		this.types = [Types.event, Types.bool];
		this.out = [this, null];
	}

	execute (props) {
		
		props = props || {};
		this.out = [this, this.data];
		if (this.to)
			this.to.execute(props);
	}

	setup (owner, image) {

		var that = this;
		owner.handPassives = owner.handPassives || [];
		owner.handPassives.push(new EListener(owner, own => this.in[0]().subscribe((t,d) => {
			if (this.in[1]({src: this.src, data: d})) {
				that.data = d;
				that.execute({ src: own, image: image });
			}
		})));
	}
}