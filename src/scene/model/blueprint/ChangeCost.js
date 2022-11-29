import Bloc from './Bloc.js';
import Types from './Types.js';

export default class ChangeCost extends Bloc {

	constructor (src, ctx) {

		super("changecost", src, ctx, true);
		this.f = (src, ins) => {
			ins[0].changeCost(ins[1]);
			return [];
		};
		this.types = [Types.card, Types.int];
	}
}