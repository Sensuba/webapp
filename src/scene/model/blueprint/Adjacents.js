import Bloc from './Bloc.js';
import Types from './Types.js';

export default class Adjacents extends Bloc {

	constructor (src, ctx) {

		super("adjacents", src, ctx);
		this.f = (src, ins) => [ins[0].adjacents];
		this.types = [Types.tile];
	}
}