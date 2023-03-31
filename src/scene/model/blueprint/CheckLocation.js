import Bloc from './Bloc.js';
import Types from './Types.js';

export default class CheckLocation extends Bloc {

	constructor (src, ctx) {

		super("checkloc", src, ctx);
		this.f = (src, ins) => [ins[0] && ins[1].includes(ins[0]), ins[0] !== null && ins[0] !== undefined];
		this.types = [Types.location, Types.locations];
	}
}