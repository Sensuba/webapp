import Bloc from './Bloc.js';
import Types from './Types.js';
import EListener from '../Listener.js';

export default class Listener extends Bloc {

	constructor (src, ctx) {

		super("listener", src, ctx, true);
		this.types = [Types.event, Types.bool, Types.int];
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
		owner.passives = owner.passives || [];
		owner.passives.push(new EListener(owner, own => this.in[0]().subscribe((t,d) => {
			let data = {};
			let code = this.in[2] ? (this.in[2]({src: this.src}) || 0) : 0;
			data[code] = d;
			if (this.in[1]({src: this.src, data})) {
				that.data = d;
				own.game.notify("listener", own);
				that.execute({ src: own, image: image });
			}
		})));
	}
}