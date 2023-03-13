import Bloc from './Bloc.js';
import Types from './Types.js';

export default class CompareLocations extends Bloc {

	constructor (src, ctx) {

		super("cmplocations", src, ctx);
		this.f = (src, ins) => {
			if (!ins[0] || !ins[1])
				return [false, false];
			return [ins[0].id === ins[1].id, ins[0].player && ins[1].player && ins[0].player.id === ins[1].player.id];
		}
		this.types = [Types.location, Types.location];
	}
}