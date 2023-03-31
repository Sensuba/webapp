import Bloc from './Bloc.js';
import Types from './Types.js';
import Listener from '../Listener.js';
import Reader from './Reader.js';

export default class DelayedTrigger extends Bloc {

	constructor (src, ctx) {

		super("delayedtrigger", src, ctx, true);
		this.f = (src, ins, props) => {
			let blueprint = this.buildBlueprint();
			ins[0].hero.blueprints.push(blueprint);
			Reader.read(blueprint, ins[0].hero);
			return [];
		};
		this.types = [Types.player, Types.event, Types.bool, Types.player, Types.timestamp, Types.int];
		this.toPrepare.push("callback");
	}

	execute (props) {
		
		props = props || {};
		let src = props.src || this.src;
		props.trace = props.trace || [];
		props.trace.push(this);
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
		owner.passives = owner.passives || [];
		owner.passives.push(listener);
		let turn = this.in[3](), timestamp = this.in[4]();
		var unsub = owner.game.subscribe(timestamp, (t,d) => {
			if (!turn || turn.playing) {
				listener.deactivate();
				owner.blueprints.splice(owner.blueprints.findIndex(b => JSON.stringify(b) === JSON.stringify(blueprint)), 1);
				owner.passives = owner.passives.filter(p => p !== listener);
				unsub();
			}
		})
		listener.init(own => this.in[1]().subscribe((t,d) => {
			let data = {};
			let code = this.in[5] ? (this.in[5]({src: this.src}) || 0) : 0;
			data[code] = d;
			if (this.in[2]({src: this.src, data})) {
				that.data = d;
				listener.deactivate();
				owner.blueprints.splice(owner.blueprints.findIndex(b => JSON.stringify(b) === JSON.stringify(blueprint)), 1);
				owner.passives = owner.passives.filter(p => p !== listener);
				unsub();
				this.out = [this.data];
				if (this.callback)
					this.callback.execute({ src: own, image: image });
			}
		}));
	}
}