import Bloc from './Bloc.js';
import Types from './Types.js';

export default class CompareCards extends Bloc {

	constructor (src, ctx) {

		super("cmpcards", src, ctx);
		this.f = (src, ins, props) => {
			if (!ins[0] || !ins[1])
				return [false, false, false];
			return [ins[0].id.type === ins[1].id.type && ins[0].id.no === ins[1].id.no, ins[0].type === ins[1].type, ins[0].player && ins[1].player && ins[0].player.id === ins[1].player.id];
		}
		this.types = [Types.card, Types.card];
	}
}