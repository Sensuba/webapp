import Bloc from './Bloc.js';

export default class ClearChoosebox extends Bloc {

	constructor (src, ctx) {

		super("clearchoosebox", src, ctx, true);
		this.f = (src, ins) => {
			var choosebox = src.game.turnPlayer.choosebox;
			choosebox.clear();
			return [];
		};
		this.types = [];
	}
}