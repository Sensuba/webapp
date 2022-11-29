var Bloc = require('./Bloc');
var Types = require('./Types');

class ForEachCard extends Bloc {

	constructor (src, ctx) {

		super("forcard", src, ctx, true);
		this.f = (src, ins, props) => {
			let lock = !src.game.broadcaster.locked;
			if (lock)
				src.game.broadcaster.lock();
			var area = ins[0], targets = ins[1];
			area.reduce((acc, loc) => acc.concat(loc.cards), []).filter(card => (targets === null || targets(src, card))).sort((a, b) => this.sort(a, b, src)).forEach (card => {
				this.out = [card];
				if (this["for each"])
					this["for each"].execute(props);
			})
			if (lock)
				src.game.broadcaster.unlock();
			this.out = null;
			if (this.completed)
				this.completed.execute(props);
			return;
		}
		this.types = [Types.locations, Types.cardfilter];
		this.toPrepare.push("for each");
		this.toPrepare.push("completed");
	}

	sort (a, b, src) {

		if (a.isHero && b.isHero)
			return a.player === src.player ? -1 : 1;
		if (a.isHero)
			return -1;
		if (b.isHero)
			return 1;

		if (!a.location.layer && !b.location.layer)
			return 0;
		if (!a.location.layer)
			return 1;
		if (!b.location.layer)
			return -1;

		if (a.location.layer !== b.location.layer)
			return a.location.layer - b.location.layer;

		if (a.location.layer !== 3) {
			if (a.player === b.player)
				return 0;
			return a.player === src.player ? -1 : 1;
		}

		if (a.index && b.index)
			return a.index - b.index;
		if (!a.index && b.index)
			return 1;
		if (a.index && !b.index)
			return -1;

		return 0;
	}
}

module.exports = ForEachCard;