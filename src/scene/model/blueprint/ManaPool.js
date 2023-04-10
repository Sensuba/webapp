import Bloc from './Bloc.js';
import Types from './Types.js';

export default class ManaPool extends Bloc {

	constructor (src, ctx) {

		super("manapool", src, ctx);
		this.f = (src, ins) => [ins[0].mana, ins[0].receptacles, ins[0].gems];
		this.types = [Types.player];
	}
}