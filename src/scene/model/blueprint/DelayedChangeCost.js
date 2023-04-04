import Bloc from './Bloc.js';
import Types from './Types.js';
import Listener from '../Listener.js';
import Aura from '../Aura.js';
import Reader from './Reader.js';
import Event from './Event.js';

export default class DelayedChangeCost extends Bloc {

	constructor (src, ctx) {

		super("delayedchangecost", src, ctx, true);
		this.f = (src, ins, props) => {
			let blueprint = this.buildBlueprint();
			ins[0].hero.addEffect(blueprint);
			return [];
		};
		this.types = [Types.player, Types.cardfilter, Types.int, Types.player, Types.timestamp];
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
		let aura = new Aura(owner, (s, x) => {x.mana = Math.max(0, x.mana + this.in[2]({src: s})); return x;}, s => [s.player.hand], s => ((this.in[1]({src: s})) || (x => true)));
		owner.passives = owner.passives || [];
		owner.passives.push(listener);
		owner.passives.push(aura);
		let turn = this.in[3](), timestamp = this.in[4]();
		var unsub = owner.game.subscribe(timestamp, (t,d) => {
			if (!turn || turn.playing) {
				listener.deactivate();
				aura.deactivate();
				owner.blueprints.splice(owner.blueprints.findIndex(b => JSON.stringify(b) === JSON.stringify(blueprint)), 1);
				owner.passives = owner.passives.filter(p => p !== listener && p !== aura);
				unsub();
			}
		})
		listener.init(own => new Event(own, "playcard.before", (t,d) => !this.in[1]({src: own}) || this.in[1]({src: own})(own, d[1]) ).subscribe((t,d) => {
			that.data = d;
			listener.deactivate();
			aura.deactivate();
			owner.blueprints.splice(owner.blueprints.findIndex(b => JSON.stringify(b) === JSON.stringify(blueprint)), 1);
			owner.passives = owner.passives.filter(p => p !== listener && p !== aura);
			unsub();
			this.out = [this.data];
			if (this.callback)
				this.callback.execute({ src: own, image: image });
		}), true);
	}
}