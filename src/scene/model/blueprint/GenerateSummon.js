import Bloc from './Bloc.js';
import Types from './Types.js';
import Card from '../Card.js';

export default class GenerateSummon extends Bloc {

	constructor (src, ctx) {

		super("generatesummon", src, ctx, true);
		this.f = (src, ins, props) => {
			var gen = null;
			if (!ins[1].isFull) {
				gen = new Card(src.game, ins[0]);
				gen.summon(ins[1]);
			}
			return [gen];
		};
		this.types = [Types.model, Types.location];
	}
}