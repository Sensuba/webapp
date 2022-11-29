import Bloc from './Bloc.js';
import Types from './Types.js';

export default class Timer extends Bloc {

	constructor (src, ctx) {

		super("timer", src, ctx, true);
		this.f = (src, ins, props) => {
			ctx.image = (ctx.image || 0) + 1;
			var timerimage = ctx.image;
			Object.keys(ctx).filter(key => key !== "image").forEach(key => ctx[key].forEach((el, i) => {
				var bloc = ctx[key][i];
				if (bloc.out && bloc !== ins[1]) {
					bloc.images[ctx.image] = bloc.out;
				}
			}));
			var unsub = src.game.subscribe(ins[1], (t,d) => {
				if (!ins[0] || ins[0].playing) {
					if (this.callback)
						this.callback.execute(Object.assign({}, props, {image: timerimage}));
					unsub();
				}
			})
		}
		this.types = [Types.player, Types.timestamp];
		this.toPrepare.push("callback");
	}
}