export default class Event {

	constructor (src, type, condition) {

		this.type = type;
		this.condition = condition;
		this.game = src.game;
	}

	check (t,d) {

		return this.type === t && this.condition(t,d);
	}

	subscribe (f) {

		return this.game.broadcaster.subscribe(this.type, (t,d) => {
			if (this.condition(t,d))
				f(t,d);
		});
	}
}