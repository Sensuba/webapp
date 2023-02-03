import Bloc from './Bloc.js';
import Types from './Types.js';
import Event from './Event.js';

export default class Trigger extends Bloc {

	constructor (name, src, ctx, event) {

		super(name, src, ctx);
		this.f = (src, ins) => [ new Event(src, event + (ins[0] !== undefined && !ins[0] ? ".before" : ""), (t,d) => true) ];
		this.types = [Types.bool];
	}
}