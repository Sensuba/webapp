import Bloc from './Bloc.js';
import Types from './Types.js';

export default class Boost extends Bloc {

	constructor (src, ctx) {

		super("boost", src, ctx);
		this.f = (src, ins) => [src.eff.booster && src.eff.booster[ins[0]] ? src.eff.booster[ins[0]] : 0];
		this.types = [Types.booster];
	}
}