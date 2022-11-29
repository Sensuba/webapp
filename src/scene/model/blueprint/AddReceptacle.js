import Bloc from './Bloc.js';
import Types from './Types.js';

export default class AddReceptacle extends Bloc {

	constructor (src, ctx) {

		super("addrec", src, ctx, true);
		this.f = (src, ins) => {
			ins[2].addReceptacles(ins[0], ins[1]);
			return [];
		};
		this.types = [Types.int, Types.bool, Types.player];
	}
}