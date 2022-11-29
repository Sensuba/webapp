import Bloc from './Bloc.js';
import Types from './Types.js';

export default class AddEffect extends Bloc {

	constructor (src, ctx) {

		super("addeffect", src, ctx, true);
		this.f = (src, ins, props) => {
			let blueprint = { basis: [], triggers: ctx.blueprint.triggers, actions: ctx.blueprint.actions, parameters: ctx.blueprint.parameters };
			Object.keys(ctx).filter(key => key !== "blueprint").forEach(key => ctx[key].forEach((el, i) => {
				var bloc = ctx[key][i];
				if (bloc === ins[1]) {
					blueprint.basis.push({type: key, index: i, out: 0});
				}
			}));
			ins[0].addEffect(blueprint);
			return [];
		};
		this.types = [Types.card, Types.effect];
	}
}