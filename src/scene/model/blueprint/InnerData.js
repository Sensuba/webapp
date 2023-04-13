import Bloc from './Bloc.js';
import Types from './Types.js';

export default class InnerData extends Bloc {

	constructor (src, ctx) {

		super("innerdata", src, ctx);
		this.f = (src, ins, props) => [props.data ? props.data[ins[0] || 0] : undefined];
		this.types = [Types.int];
	}
}