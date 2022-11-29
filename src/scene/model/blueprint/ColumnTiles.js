import Bloc from './Bloc.js';
import Types from './Types.js';

export default class ColumnTiles extends Bloc {

	constructor (src, ctx) {

		super("columntiles", src, ctx);
		this.f = (src, ins) => [[src.game.field.tiles[0][ins[0]], src.game.field.tiles[1][ins[0]]]];
		this.types = [Types.column];
	}
}