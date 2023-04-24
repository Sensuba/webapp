import Bloc from './Bloc.js';
import Types from './Types.js';

export default class AddToChoosebox extends Bloc {

	constructor (src, ctx) {

		super("addchoosebox", src, ctx, true);
		this.f = (src, ins) => {
			var choosebox = src.game.turnPlayer.choosebox;
			if (ins[0])
				choosebox.addItem(ins[0], "card");
			if (ins[1])
				choosebox.addItem(ins[1], "model");
			return [];
		};
		this.types = [Types.card, Types.model];
	}
}