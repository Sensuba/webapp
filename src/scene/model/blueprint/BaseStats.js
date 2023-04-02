import Bloc from './Bloc.js';
import Types from './Types.js';

export default class BaseStats extends Bloc {

	constructor (src, ctx) {

		super("basestats", src, ctx);
		this.f = (src, ins) => [ins[0].mana, ins[0].atk, Math.min(ins[0].currentHp, ins[0].hp), ins[0].hp];
		this.types = [Types.card];
	}
}