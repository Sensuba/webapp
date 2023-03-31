import Bloc from './Bloc.js';
import Types from './Types.js';

export default class BreakCard extends Bloc {

	constructor (src, ctx) {

		super("brkcard", src, ctx);
		this.f = (src, ins) => [ins[0].model, ins[0].location, ins[0].player, ins[0].cardType, ins[0].eff ? ins[0].eff.mana : ins[0].mana, ins[0].eff ? ins[0].eff.atk : ins[0].atk, ins[0].eff ? ins[0].currentHp : ins[0].hp, ins[0].eff ? ins[0].eff.hp : ins[0].hp];
		this.types = [Types.card];
	}
}