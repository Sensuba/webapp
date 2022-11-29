var Bloc = require('./Bloc');
var Types = require('./Types');
var AuraEffect = require('../Aura');

class Aura extends Bloc {

	constructor (src, ctx) {

		super("aura", src, ctx, true);
		this.f = (src, ins) => [this];
		this.types = [Types.mutation, Types.locations, Types.cardfilter];
		this.out = [this];
	}

	setup (owner, image) {

		owner.passives.push(new AuraEffect(owner, (s, x) => this.in[0]({src: s, data: x})(x), s => this.in[1]({src: s}), s => ((this.in[2]({src: s})) || (x => true))));
	}
}

module.exports = Aura;