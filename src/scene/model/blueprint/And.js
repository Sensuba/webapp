import Bloc from './Bloc.js';
import Types from './Types.js';

export default class And extends Bloc {

	constructor (src, ctx) {

		super("opand", src, ctx);
		this.f = (src, props) => {
			var a = this.in[0](props);
			if (!a)
				return [false];
			var b = this.in[1](props);
			return [b];
		}
		this.types = [Types.bool, Types.bool];
	}

	execute (props) {
		
		props = props || {};
		let src = props.src || this.src;
		var f = this.f || (() => []);
		props.trace = props.trace || [];
		props.trace.push(this);
		this.out = f(src, props);
		if (this.to)
			this.to.execute(props);
	}
}