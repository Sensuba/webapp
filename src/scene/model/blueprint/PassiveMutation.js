var Bloc = require('./Bloc');
var Types = require('./Types');
var Mutation = require('../Mutation');

class PassiveMutation extends Bloc {

	constructor (src, ctx) {

		super("passivemut", src, ctx, true);
		this.f = (src, ins) => [this];
		this.types = [Types.mutation];
		this.out = [this];
	}

	setup (owner, image) {

		//var cpt = this.computeIn();
		var mut = x => this.in[0]({src: owner, data: x})(x);
		owner.passives = owner.passives || [];
		owner.passives.push(new Mutation(owner, mut, 3));
	}
}

module.exports = PassiveMutation;