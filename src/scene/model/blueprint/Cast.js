import Bloc from './Bloc.js';
import Types from './Types.js';

export default class Cast extends Bloc {

	constructor (src, ctx) {

		super("cast", src, ctx, true);
		this.f = (src, ins) => {
			switch (ins[0].targetType) {
			case "column": {
				let target = {type: "column", data: ins[2]};
				if (ins[0].canTarget(ins[1], target))
					ins[0].cast(ins[1], target);
				break;
			}
			case "card": {
				let target = {type: "card", data: ins[3]};
				if (ins[0].canTarget(ins[1], target))
					ins[0].cast(ins[1], target);
				break;
			}
			default: {
				ins[0].cast(ins[1]);
				break;
			}
			}
			return [];
		};
		this.types = [Types.card, Types.player, Types.column, Types.card];
	}
}