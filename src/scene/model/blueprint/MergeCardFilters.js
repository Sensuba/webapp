import Bloc from './Bloc.js';
import Types from './Types.js';

export default class MergeCardFilters extends Bloc {

	constructor (src, ctx) {

		super("mergecfilters", src, ctx);
		this.f = (src, ins) => [(src, target) => (ins[0](src, target) || ins[1](src, target)), (src, target) => (ins[0](src, target) && ins[1](src, target))];
		this.types = [Types.cardfilter, Types.cardfilter];
	}
}