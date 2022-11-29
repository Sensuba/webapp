import Bloc from './Bloc.js';
import Types from './Types.js';

export default class Copy extends Bloc {

	constructor (src, ctx) {

		super("copy", src, ctx, true);
		this.f = (src, ins) => {
			for (let i = 0; i < ins[1]; i++) {
				let reset = ins[2].layer < ins[0].location.layer;
				let copy = ins[0].copy(reset);
				if (ins[2].id.type === "tile")
					copy.summon(ins[2]);
				else copy.goto(ins[2]);
			}
			return [];
		};
		this.types = [Types.card, Types.int, Types.location];
	}
}