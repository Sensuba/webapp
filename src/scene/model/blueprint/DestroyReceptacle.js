import Bloc from './Bloc.js';
import Types from './Types.js';

export default class DestroyReceptacle extends Bloc {

	constructor (src, ctx) {

		super("destroyreceptacle", src, ctx, true);
		this.f = (src, ins) => {
			ins[0].destroyReceptacles(ins[1]);
			return [];
		};
		this.types = [Types.player, Types.int];
	}
}