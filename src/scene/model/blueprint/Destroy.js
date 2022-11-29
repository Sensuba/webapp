import Bloc from './Bloc.js';
import Types from './Types.js';

export default class Destroy extends Bloc {

	constructor (src, ctx) {

		super("destroy", src, ctx, true);
		this.f = (src, ins) => {
			ins[0].destroy();
			return [];
		};
		this.types = [Types.card];
	}
}