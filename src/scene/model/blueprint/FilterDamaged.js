import Bloc from './Bloc.js';
import Types from './Types.js';

export default class FilterDamaged extends Bloc {

	constructor (src, ctx) {

		super("filterdamaged", src, ctx);
		this.f = (src, ins) => [(src, target) => (ins[0] === null || ins[0] <= 0 || (target.dmg && target.dmg >= ins[0])) && (ins[1] === null || !target.dmg || target.dmg <= ins[1])];
		this.types = [Types.int, Types.int];
	}
}