var Bloc = require('./Bloc');
var Types = require('./Types');
//var Bank = require("../../Bank");

class Token extends Bloc {

	constructor (src, ctx) {

		super("token", src, ctx);
		this.f = (src, ins) => {
			if (ins[0] === null)
				ins[0] = 0;
			if (ins[0] < 0)
				return [];
			else
				return [{ parent: this.genParent(this.src), token: ins[0] }];
		}
		this.types = [Types.int];
	}

	genParent (src) {

		if (src.idCardmodel)
			return src.idCardmodel;
		return { parent: this.genParent(src.parent), token: src.parent.tokens.findIndex((token, i) => i === src.notoken) };
	}
}

module.exports = Token;