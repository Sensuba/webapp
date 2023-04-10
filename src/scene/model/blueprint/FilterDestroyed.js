import Bloc from './Bloc.js';
import Types from './Types.js';

export default class FilterDestroyed extends Bloc {

	constructor (src, ctx) {

		super("filterdestroyed", src, ctx);
		this.f = (src, ins) => [(src, target) => target.destroyed || target.ghost, (src, target) => ((target.isUnit && target.onField) || target.isHero) && !target.ghost];
		this.types = [];
	}
}