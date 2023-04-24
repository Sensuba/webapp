import Bloc from './Bloc.js';
import Types from './Types.js';

export default class LocationToLocations extends Bloc {

	constructor (src, ctx) {

		super("loctolocs", src, ctx);
		this.f = (src, ins) => [[ins[0]]];
		this.types = [Types.location];
	}
}