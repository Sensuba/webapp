import Bloc from './Bloc.js';
import Types from './Types.js';

export default class UseMana extends Bloc {

	constructor (src, ctx) {

		super("usemana", src, ctx, true);
		this.f = (src, ins) => [ins[0].pay(ins[1])];
		this.types = [Types.area, Types.int];
	}
}