import Bloc from './Bloc.js';
import Types from './Types.js';

export default class CheckTile extends Bloc {

	constructor (src, ctx) {

		super("checktile", src, ctx);
		this.f = (src, ins) => [!ins[1] || ins[1](src, ins[0])];
		this.types = [Types.location, Types.tilefilter];
	}
}