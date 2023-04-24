import Bloc from './Bloc.js';
import Types from './Types.js';

export default class AddModelToChoosebox extends Bloc {

	constructor (src, ctx) {

		super("addmodelchoosebox", src, ctx, true);
		this.f = (src, ins) => {
			var choosebox = src.game.turnPlayer.choosebox;
			if (ins[0])
				choosebox.addItem(ins[0], "model");
			return [];
		};
		this.types = [Types.model];
	}
}