import Bloc from './Bloc.js';
import Types from './Types.js';

export default class ConditionalMutation extends Bloc {

	constructor (src, ctx) {

		super("conditionmut", src, ctx);
		this.f = (src, ins, props) => [x => this.in[1](Object.assign({}, props, {data: {0: x}})) ? this.in[0](props)(x) : x];
		this.types = [Types.mutation, Types.bool];
	}

	execute (props) {
		
		props = props || {};
		let src = props.src || this.src;
		var f = this.f || (() => []);
		this.out = f(src, [], props);
		if (this.to)
			this.to.execute(props);
	}
}