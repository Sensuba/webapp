import Bloc from './Bloc.js';
import Types from './Types.js';

export default class Switch extends Bloc {

	constructor (src, ctx) {

		super("switch", src, ctx, true);
		this.f = (src, ins) => {
			ins[0].switch();
			return [];
		};
		this.types = [Types.tile];
	}
}