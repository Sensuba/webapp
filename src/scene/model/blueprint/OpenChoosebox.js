import Bloc from './Bloc.js';
import Types from './Types.js';

export default class OpenChoosebox extends Bloc {

	constructor (src, ctx) {

		super("openchoosebox", src, ctx, true);
		this.f = (src, ins) => {
			var choosebox = src.game.turnPlayer.choosebox;
			if (!choosebox.isEmpty) {
				if (src.autocasting) {
					let choice = choosebox.items[Math.floor(Math.random() * choosebox.items.length)];
					if (ins[1])
						choosebox.clear();
					if (src.chooseboxtrigger && src.chooseboxtrigger[ins[0] || 0])
						src.chooseboxtrigger[ins[0] || 0](choice);
				} else {
					choosebox.open({src, code: ins[0] || 0}, ins[1]);
				}
			}
			return [];
		};
		this.types = [Types.int, Types.bool];
	}
}