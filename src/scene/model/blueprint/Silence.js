import Bloc from './Bloc.js';
import Types from './Types.js';

export default class Silence extends Bloc {

	constructor (src, ctx) {

		super("silence", src, ctx, true);
		this.f = (src, ins) => {
			ins[0].silence();
			return [];
		};
		this.types = [Types.card];
	}
}