import Bloc from './Bloc.js';
import Types from './Types.js';
import Card from '../Card.js';

export default class Summon extends Bloc {

	constructor (src, ctx) {

		super("summon", src, ctx, true);
		this.f = (src, ins, props) => {
			var card = null;
			if (!ins[1].isFull) {
				card = ins[0].summon(ins[1]);
			}
			return [card];
		};
		this.types = [Types.card, Types.location];
	}
}