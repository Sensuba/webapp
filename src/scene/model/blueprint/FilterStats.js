import Bloc from './Bloc.js';
import Types from './Types.js';

export default class FilterStats extends Bloc {

	constructor (src, ctx) {

		super("filterstats", src, ctx);
		this.f = (src, ins) => {

			var parsing = value => isNaN(value) ? parseInt(value, 10) : value;
			var checkmana = target => (ins[0] === null || (!isNaN(target.mana) && parsing(target.mana) >= ins[0])) && (ins[1] === null || (!isNaN(target.mana) && parsing(target.mana) <= ins[1]));
			var checkatk = target => (ins[2] === null || (!isNaN(target.atk) && parsing(target.atk) >= ins[2])) && (ins[3] === null || (!isNaN(target.atk) && parsing(target.atk) <= ins[3]));
			var checkhp = target => (ins[4] === null || (!isNaN(target.hp) && parsing(target.hp) >= ins[4])) && (ins[5] === null || (!isNaN(target.hp) && parsing(target.hp) <= ins[5]));
			var cardfilter = (src, target) => checkmana(target.eff) && checkatk(target.eff) && checkhp(target.eff);
			var modelfilter = (src, target) => checkmana(target) && checkatk(target) && checkhp(target);
			
			return [cardfilter, modelfilter];
		};
		this.types = [Types.int, Types.int, Types.int, Types.int, Types.int, Types.int];
	}
}