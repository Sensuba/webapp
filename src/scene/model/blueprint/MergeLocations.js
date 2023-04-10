import Bloc from './Bloc.js';
import Types from './Types.js';

export default class MergeLocations extends Bloc {

	constructor (src, ctx) {

		super("mergeloc", src, ctx);
		this.f = (src, ins) => {
			var or = ins[0].concat(ins[1]);
			or = or.filter((item, index) => or.indexOf(item) === index);
			var and = ins[0].filter(i => ins[1].includes(i));
			return [or, and];
		};
		this.types = [Types.locations, Types.locations];
	}
}