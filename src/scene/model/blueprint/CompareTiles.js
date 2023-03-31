import Bloc from './Bloc.js';
import Types from './Types.js';

export default class CompareTiles extends Bloc {

	constructor (src, ctx) {

		super("cmptiles", src, ctx);
		this.f = (src, ins) => ins[0] && ins[1] && ins[0].id.type === "tile" && ins[1].id.type === "tile" ?
		[ins[0].id === ins[1].id, ins[0].player.id === ins[1].player.id, ins[0].adjacents.some(t => t.id === ins[1].id), ins[0].opposite.id === ins[1].id, Math.abs(ins[0].x - ins[1].x)] :
		[false, false, false, false, -1];
		this.types = [Types.location, Types.location];
	}
}