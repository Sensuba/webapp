import Bloc from './Bloc.js';
import Types from './Types.js';

export default class If extends Bloc {

	constructor (src, ctx) {

		super("if", src, ctx, true);
		this.f = (src, ins, props) => {
			var next = ins[0] ? this.true : this.false;
			if (next)
				next.execute(props);
		}
		this.types = [Types.bool];
		this.toPrepare.push("true");
		this.toPrepare.push("false");
	}
}