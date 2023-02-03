import Bloc from './Bloc.js';
import Types from './Types.js';
import Listener from '../Listener.js';
import Mutation from '../Mutation.js';
import Reader from './Reader.js';
import Event from './Event.js';

export default class AddMutation extends Bloc {

	constructor (src, ctx) {

		super("addmut", src, ctx, true);
		this.f = (src, ins, props) => {
			let blueprint = this.buildBlueprint();
			ins[0].addEffect(blueprint);
			return [];
		};
		this.types = [Types.card, Types.mutation, Types.player, Types.timestamp];
	}

	execute (props) {
		
		props = props || {};
		let src = props.src || this.src;
		var f = this.f || (() => []);
		this.out = f(src, [this.in[0](props)], props);
		if (this.to)
			this.to.execute(props);
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
		let listener = new Listener(owner);
		var mut = x => this.in[1]({src: owner, data: x})(x);
		let mutation = new Mutation(owner, mut, 2);
		owner.passives = owner.passives || [];
		owner.passives.push(mutation);
		mutation.activate();
		let turn = this.in[2](), timestamp = this.in[3]();
		var unsub = owner.game.subscribe(timestamp, (t,d) => {
			if (!turn || turn.playing) {
				mutation.deactivate();
				owner.blueprints.splice(owner.blueprints.findIndex(b => JSON.stringify(b) === JSON.stringify(blueprint)), 1);
				owner.passives = owner.passives.filter(p => p !== mutation);
				unsub();
			}
		})
	}
}