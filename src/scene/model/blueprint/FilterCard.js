import Bloc from './Bloc.js';
import Types from './Types.js';

export default class FilterCard extends Bloc {

	constructor (src, ctx) {

		super("filtercard", src, ctx);
		this.f = (src, ins) => [
			(src, target) => target && target === ins[0],
			(src, target) => target !== ins[0],
			(src, target) => target && ins[0] && target.model.key !== ins[0].model.key,
			(src, target) => target && ins[0] && target.model.key === ins[0].model.key
		];
		this.types = [Types.card];
	}
}