import Bloc from './Bloc.js';
import Types from './Types.js';

export default class SkillFreshness extends Bloc {

	constructor (src, ctx) {

		super("skillfresh", src, ctx);
		this.f = (src, ins) => [ins[0].hero.skillUsed === false || ins[0].hero.skillUsed === undefined];
		this.types = [Types.player];
	}
}