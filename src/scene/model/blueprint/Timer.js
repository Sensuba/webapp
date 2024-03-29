import Bloc from './Bloc.js';
import Types from './Types.js';
import Reader from './Reader.js';


export default class Timer extends Bloc {

	constructor (src, ctx) {

		super("timer", src, ctx, true);
		this.f = (src, ins, props) => {
			let blueprint = this.buildBlueprint();
			ins[0].blueprints.push(blueprint);
			Reader.read(blueprint, ins[0]);
			return [];
		};
		this.types = [Types.card, Types.player, Types.timestamp];
		this.toPrepare.push("callback");
	}

	buildBlueprint () {

		let blueprint = { basis: [], triggers: this.ctx.blueprint.triggers, actions: this.ctx.blueprint.actions, parameters: this.ctx.blueprint.parameters };
		Object.keys(this.ctx).filter(key => key !== "blueprint").forEach(key => this.ctx[key].forEach((el, i) => {
			var bloc = this.ctx[key][i];
			if (bloc === this) {
				blueprint.basis.push({type: key, index: i});
			}
		}));

		return blueprint;
	}

	setup (owner, image) {

		var that = this;
		let blueprint = this.buildBlueprint();
		let turn = this.in[1](), timestamp = this.in[2]();
		var unsub = owner.game.subscribe(timestamp, (t,d) => {
			if (!turn || turn.playing) {
				owner.blueprints.splice(owner.blueprints.findIndex(b => JSON.stringify(b) === JSON.stringify(blueprint)), 1);
				unsub();
				if (this.callback)
					this.callback.execute({ src: owner, image: image });
			}
		});
	}
}