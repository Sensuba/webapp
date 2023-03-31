import Bloc from './Bloc.js';
import Types from './Types.js';

export default class ForEachEvent extends Bloc {

	constructor (src, ctx) {

		super("forevent", src, ctx, true);
		this.f = (src, ins, props) => {
			var logs = [];
			switch (ins[1]) {
				case 0: logs = this.logsAllGame(ins[0], props); break;
				case 1: logs = this.logsThisTurn(ins[0], props); break;
				case 2: logs = this.logsOpponentsTurn(ins[0], props); break;
				case 3: logs = this.logsSincePreviousTurn(ins[0], props); break;
				case 4: logs = this.logsPreviousTurn(ins[0], props); break;
				default: break;
			}

			logs.forEach (log => {
				this.out = [log.data];
				if (this["for each"])
					this["for each"].execute(props);
			})
			this.out = null;
			if (this.completed)
				this.completed.execute(props);
			return;
		}
		this.types = [Types.event, Types.period, Types.bool, Types.int];
		this.toPrepare.push("for each");
		this.toPrepare.push("completed");
	}

	execute (props) {
		
		props = props || {};
		let src = props.src || this.src;
		props.trace = props.trace || [];
		props.trace.push(this);
		var f = this.f || (() => []);
		this.out = f(src, [this.in[0](props), this.in[1](props)], props);
	}

	logsThisTurn (event, props) {

		let c = [];
		event.game.broadcaster.log.forEach(log => {
			if (log.type === "newturn")
				c = [];
			let nprops = Object.assign({}, props);
			nprops.data = nprops.data || {};
			let code = this.in[3] ? (this.in[3]({src: this.src}) || 0) : 0;
			nprops.data[code] = log.data;
			if (event.check(log.type, log.data) && this.in[2](nprops))
				c.push(log);
		})
		return c;
	}

	logsOpponentsTurn (event, props) {

		let c = [], you = false;
		event.game.broadcaster.log.forEach(log => {
			if (log.type === "newturn") {
				if (log.data[0].id.no !== this.src.player.id.no) {
					you = false;
					c = [];
				} else you = true;
			}
			if (you)
				return;
			let nprops = Object.assign({}, props);
			nprops.data = nprops.data || {};
			let code = this.in[3] ? (this.in[3]({src: this.src}) || 0) : 0;
			nprops.data[code] = log.data;
			if (event.check(log.type, log.data) && this.in[2](nprops))
				c.push(log);
		})
		return c;
	}

	logsSincePreviousTurn (event, props) {

		let c = [];
		event.game.broadcaster.log.forEach(log => {
			if (log.type === "newturn" && log.data[0].id.no !== this.src.player.id.no)
				c = [];
			let nprops = Object.assign({}, props);
			nprops.data = nprops.data || {};
			let code = this.in[3] ? (this.in[3]({src: this.src}) || 0) : 0;
			nprops.data[code] = log.data;
			if (event.check(log.type, log.data) && this.in[2](nprops))
				c.push(log);
		})
		return c;
	}

	logsPreviousTurn (event, props) {

		let c = [], n = [], you = false;
		event.game.broadcaster.log.forEach(log => {
			if (log.type === "newturn") {
				if (log.data[0].id.no === this.src.player.id.no) {
					you = true;
					c = n;
					n = [];
				} else you = false;
			}
			if (!you)
				return;
			let nprops = Object.assign({}, props);
			nprops.data = nprops.data || {};
			let code = this.in[3] ? (this.in[3]({src: this.src}) || 0) : 0;
			nprops.data[code] = log.data;
			if (event.check(log.type, log.data) && this.in[2](nprops))
				n.push(log);
		})
		return c;
	}

	logsAllGame (event, props) {

		return event.game.broadcaster.log.filter(log => {
			let nprops = Object.assign({}, props);
			nprops.data = nprops.data || {};
			let code = this.in[3] ? (this.in[3]({src: this.src}) || 0) : 0;
			nprops.data[code] = log.data;
			return event.check(log.type, log.data) && this.in[2](nprops)
		});
	}
}