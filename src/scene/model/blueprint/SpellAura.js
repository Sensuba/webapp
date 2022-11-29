var Bloc = require('./Bloc');
var Types = require('./Types');
var AuraEffect = require('../Aura');

class SpellAura extends Bloc {

	constructor (src, ctx) {

		super("spellaura", src, ctx, true);
		this.f = (src, ins) => [this];
		this.types = [Types.mutation, Types.player, Types.cardfilter];
		this.out = [this];
	}

	setup (owner, image) {

		owner.passives.push(new AuraEffect(owner, (s, x) => this.in[0]({src: s, data: x})(x), s => this.in[1]({src: s}), s => ((this.in[2]({src: s})) || (x => true)), true));
	}
}

module.exports = SpellAura;