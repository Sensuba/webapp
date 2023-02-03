import Bloc from './Bloc.js';
import Types from './Types.js';

export default class FilterEffect extends Bloc {

	constructor (src, ctx) {

		super("filtereffect", src, ctx);
		this.f = (src, ins) => [(src, target) => target && target.innereffects && target.innereffects.some(e => ins[0](e)), model => model.blueprint.basis.some(basis => ins[0](model.blueprint[basis.type][basis.index]))];
		this.types = [Types.effecttype];
	}
}