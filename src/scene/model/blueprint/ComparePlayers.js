import Bloc from './Bloc.js';
import Types from './Types.js';

export default class ComparePlayers extends Bloc {

	constructor (src, ctx) {

		super("cmpplayers", src, ctx);
		this.f = (src, ins) => [ins[0].id === ins[1].id];
		this.types = [Types.player, Types.player];
	}
}