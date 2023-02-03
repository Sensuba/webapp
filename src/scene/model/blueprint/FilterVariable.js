import Bloc from './Bloc.js';
import Types from './Types.js';

export default class FilterVariable extends Bloc {

	constructor (src, ctx) {

		super("filtervar", src, ctx);
		this.f = (src, ins) => [(card, target) => target && target.getVariable(ins[0]) !== undefined];
		this.types = [Types.string];
	}
}