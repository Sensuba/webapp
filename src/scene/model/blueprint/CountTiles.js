import Bloc from './Bloc.js';
import Types from './Types.js';

export default class CountTiles extends Bloc {

	constructor (src, ctx) {

		super("counttiles", src, ctx);
		this.f = (src, ins) => [ins[0].filter(tile => ins[1](src, tile)).length];
		this.types = [Types.locations, Types.tilefilter];
	}
}