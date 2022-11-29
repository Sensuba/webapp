import Bloc from './Bloc.js';
import Types from './Types.js';

export default class Extremum extends Bloc {

	constructor (src, ctx) {

		super("extremum", src, ctx);
		this.f = (src, ins) => {

			var lmana, hmana, latk, hatk, lhp, hhp;

			ins[0].forEach(loc => {
				loc.cards.forEach(card => {
					if (ins[1] && !ins[1](src, card))
						return;
					var eff = card.eff || card;
					if (!lmana || eff.mana < lmana.eff.mana)
						lmana = card;
					if (!hmana || eff.mana > hmana.eff.mana)
						hmana = card;
					if (!latk || eff.atk < latk.eff.atk)
						latk = card;
					if (!hatk || eff.atk > hatk.eff.atk)
						hatk = card;
					if (!lhp || card.currentHp < lhp.currentHp)
						lhp = card;
					if (!hhp || card.currentHp > hhp.currentHp)
						hhp = card;
				});
			});
			
			return [lmana, hmana, latk, hatk, lhp, hhp];
		};
		this.types = [Types.locations, Types.cardfilter];
	}
}