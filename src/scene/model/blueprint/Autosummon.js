import Bloc from './Bloc.js';
import Types from './Types.js';
import Card from '../Card.js';

export default class Autoummon extends Bloc {

	constructor (src, ctx) {

		super("autosummon", src, ctx, true);
		this.f = (src, ins, props) => {
			var card = null;
			var tiles = ins[1].tiles;
			var count = tiles.map(t => t.unitCount);
			var candidates = [];
			for (let i = 0; i < 2; i++) {
				if (candidates.length > 0)
					break;
				if (count[2] === i) {
					candidates.push(tiles[2]);
					break;
				}
				if (count[1] === i)
					candidates.push(tiles[1]);
				if (count[3] === i)
					candidates.push(tiles[3]);
				if (candidates.length > 0)
					break;
				if (count[0] === i)
					candidates.push(tiles[0]);
				if (count[4] === i)
					candidates.push(tiles[4]);
				if (candidates.length > 0)
					break;
			}
			if (candidates.length <= 0)
				return [null, null];
			let tile = candidates[Math.floor(Math.random() * candidates.length)];
			card = ins[0].summon(tile);
			return [card, tile];
		};
		this.types = [Types.card, Types.player];
	}
}