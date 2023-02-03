import Bloc from './Bloc.js';
import Types from './Types.js';

export default class Animation extends Bloc {

	constructor (src, ctx) {

		super("animation", src, ctx, true);
		this.f = (src, ins) => {
			src.game.notify("animation", ins[0], ins[1], ins[2]);
			return [];
		};
		this.types = [Types.string, Types.column, Types.card];
	}
}