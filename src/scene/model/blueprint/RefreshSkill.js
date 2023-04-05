import Bloc from './Bloc.js';
import Types from './Types.js';

export default class RefreshSkill extends Bloc {

	constructor (src, ctx) {

		super("refreshskill", src, ctx, true);
		this.f = (src, ins) => {
			ins[0].hero.refreshSkill();
			return [];
		};
		this.types = [Types.player];
	}
}