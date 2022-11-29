import Bloc from './Bloc.js';
import Types from './Types.js';

export default class ColumnSide extends Bloc {

	constructor (src, ctx) {

		super("columnside", src, ctx);
		this.f = (src, ins) => [ins[1].tiles[ins[0]]];
		this.types = [Types.column, Types.player];
	}
}