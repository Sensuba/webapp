import Bloc from './Bloc.js';
import Types from './Types.js';

export default class ConditionalColumn extends Bloc {

	constructor (src, ctx) {

		super("conditioncolumn", src, ctx);
		this.f = (src, ins, props) => [(src, target) => ins[0](src, target) && this.in[1](props)];
		this.types = [Types.columnfilter, Types.bool];
	}

	execute (props) {
		
		props = props || {};
		let src = props.src || this.src;
		props.trace = props.trace || [];
		props.trace.push(this);
		var f = this.f || (() => []);
		this.out = f(src, [this.in[0](props)], props);
		if (this.to)
			this.to.execute(props);
	}
}