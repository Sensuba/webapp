import Bloc from './Bloc.js';
import Types from './Types.js';

export default class Send extends Bloc {

	constructor (src, ctx) {

		super("send", src, ctx, true);
		this.f = (src, ins) => {
			let card = ins[0].sendTo(ins[1]);
			return [card];
		}
		this.types = [Types.card, Types.location];
	}
}