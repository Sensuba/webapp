import Bloc from './Bloc.js';

export default class CurrentPlayer extends Bloc {

	constructor (src, ctx) {

		super("current", src, ctx);
		this.f = (src, ins) => [ src.game.turnPlayer ];
		this.types = [];
	}
}