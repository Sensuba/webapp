import Bloc from './Bloc.js';
import Types from './Types.js';

export default class BreakLocation extends Bloc {

	constructor (src, ctx) {

		super("brklocation", src, ctx);
		this.f = (src, ins) => [ins[0].player, ins[0].count, ins[0].isEmpty];
		this.types = [Types.location];
	}
}