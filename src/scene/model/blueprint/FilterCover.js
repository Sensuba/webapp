import Bloc from './Bloc.js';

export default class FilterCover extends Bloc {

	constructor (src, ctx) {

		super("filtercover", src, ctx);
		this.f = (src, ins) => [
			(src, target) => target && target.inFront,
			(src, target) => target && target.inBack
		];
		this.types = [];
	}
}