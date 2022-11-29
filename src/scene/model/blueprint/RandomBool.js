import Bloc from './Bloc.js';

export default class RandomBool extends Bloc {

	constructor (src, ctx) {

		super("randbool", src, ctx);
		this.f = (src, ins) => [Math.random() < 0.5];
	}
}