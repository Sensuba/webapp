import Bloc from './Bloc.js';
import Types from './Types.js';

export default class AddToChoosebox extends Bloc {

	constructor (src, ctx) {

		super("addcardchoosebox", src, ctx, true);
		this.f = (src, ins) => {
			var choosebox = src.game.turnPlayer.choosebox;
			if (ins[0])
				choosebox.addItem(ins[0], "card");
			return [];
		};
		this.types = [Types.card];
	}
}