var Bloc = require('./Bloc');

class FilterCover extends Bloc {

	constructor (src, ctx) {

		super("filtercover", src, ctx);
		this.f = (src, ins) => [
			(src, target) => target && target.inFront,
			(src, target) => target && target.inBack
		];
		this.types = [];
	}
}

module.exports = FilterCover;