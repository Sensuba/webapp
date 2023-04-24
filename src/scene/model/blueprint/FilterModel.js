import Bloc from './Bloc.js';
import Types from './Types.js';

export default class FilterModel extends Bloc {

	constructor (src, ctx) {

		super("filtermodel", src, ctx);
		this.f = (src, ins) => [(src, target) => target && target.model.key === ins[0].key];
		this.types = [Types.model];
	}
}