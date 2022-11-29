import Bloc from './Bloc.js';

export default class InnerData extends Bloc {

	constructor (src, ctx) {

		super("innerdata", src, ctx);
		this.f = (src, ins, props) => [props.data];
		this.types = [];
	}
}