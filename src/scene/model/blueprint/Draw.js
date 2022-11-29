import Bloc from './Bloc.js';
import Types from './Types.js';

export default class Draw extends Bloc {

	constructor (src, ctx) {

		super("draw", src, ctx, true);
		this.f = (src, ins, props) => {
			for (let i = 0; i < ins[0]; i++) {
				let card = ins[1].draw();
				this.out = [card, i];
				if (this["for each"])
					this["for each"].execute(props);
			}
			this.out = null;
			if (this.completed)
				this.completed.execute(props);
			
			return;
		};
		this.types = [Types.int, Types.player];
		this.toPrepare.push("for each");
		this.toPrepare.push("completed");
	}
}