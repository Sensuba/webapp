import Bloc from './Bloc.js';

export default class FilterChoosebox extends Bloc {

	constructor (src, ctx) {

		super("filterchoosebox", src, ctx);
		this.f = (src, ins) => [
			(src, target) => src.game.turnPlayer.choosebox.queue.length > 0 ? src.game.turnPlayer.choosebox.queue[src.game.turnPlayer.choosebox.queue.length-1].items.every(i => i.type !== "card" || i.element.key !== target.key) : src.game.turnPlayer.choosebox.items.every(i => i.type !== "card" || i.element.key !== target.key),
			target => src.game.turnPlayer.choosebox.queue.length > 0 ? src.game.turnPlayer.choosebox.queue[src.game.turnPlayer.choosebox.queue.length-1].items.every(i => i.type !== "model" || i.element.key !== target.key) : src.game.turnPlayer.choosebox.items.every(i => i.type !== "model" || i.element.key !== target.key)
		];
		this.types = [];
	}
}