import Bloc from './Bloc.js';

export default class Trigger extends Bloc {

	constructor (name, src, ctx, event) {

		super(name, src, ctx);
		this.f = (src, ins) => [ new Event(src, event, (s,d) => true) ];
		this.types = [];
	}
}