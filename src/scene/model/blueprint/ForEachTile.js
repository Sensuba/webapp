import Bloc from './Bloc.js';
import Types from './Types.js';

export default class ForEachTile extends Bloc {

	constructor (src, ctx) {

		super("fortile", src, ctx, true);
		this.f = (src, ins, props) => {
			var area = ins[0], targets = ins[1];
			area.filter(tile => (targets === null || targets(src, tile))).forEach (tile => {
				this.out = [tile];
				if (this["for each"])
					this["for each"].execute(props);
			})
			this.out = null;
			if (this.completed)
				this.completed.execute(props);
			return;
		}
		this.types = [Types.tiles, Types.tilefilter];
		this.toPrepare.push("for each");
		this.toPrepare.push("completed");
	}
}