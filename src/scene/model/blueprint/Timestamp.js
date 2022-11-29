import Bloc from './Bloc.js';
import Types from './Types.js';
import Event from './Event.js';

export default class Timestamp extends Bloc {

	constructor (src, ctx) {

		super("timestamp", src, ctx);
		this.f = (src, ins) => [ new Event(src, ins[1], (t,d) => !ins[0] || ins[0].playing) ];
		this.types = [Types.player, Types.timestamp];
	}
}