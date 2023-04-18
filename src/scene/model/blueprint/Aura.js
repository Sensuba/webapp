import Bloc from './Bloc.js';
import Types from './Types.js';
import AuraEffect from '../Aura.js';

export default class Aura extends Bloc {

	constructor (src, ctx) {

		super("aura", src, ctx, true);
		this.f = (src, ins) => [this];
		this.types = [Types.mutation, Types.locations, Types.cardfilter, Types.int];
		this.out = [this];
	}

	setup (owner, image) {

		owner.passives.push(new AuraEffect(owner, (s, x) => {
			let code = this.in[3] ? (this.in[3]({src: this.src}) || 0) : 0;
			let data = {};
			data[code] = x;
			return this.in[0]({src: s, data})(x);
		}, s => this.in[1]({src: s}), s => ((this.in[2]({src: s})) || (x => true))));
	}
}