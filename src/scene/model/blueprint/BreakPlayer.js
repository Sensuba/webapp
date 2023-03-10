import Bloc from './Bloc.js';
import Types from './Types.js';

export default class BreakPlayer extends Bloc {

	constructor (src, ctx) {

		super("brkplayer", src, ctx);
		this.f = (src, ins) => [ins[0].tiles, ins[0].hand, ins[0].deck, ins[0].opponent, ins[0].playing];
		this.types = [Types.player];
	}
}