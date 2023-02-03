
export default class Broadcaster {

	log = [];
	subscriptions = {};
	indexSubscription = 0;

	constructor (game) {

		this.game = game;
	}

	subscribe (type, notify) {

		if (!this.subscriptions[type])
			this.subscriptions[type] = [];
		let id = this.indexSubscription++;
		this.subscriptions[type].push({ id, notify });
		return () => this.subscriptions[type].splice(this.subscriptions[type].findIndex(sub => sub.id === id), 1);
	}

	start () {

	}

	stop () {

	}

	notify (type, data) {
		
	}

	lock () {

	}

	unlock () {

	}

	trigger (type, data) {

		let datamap = type === "gamestate" ? data : data.map(d => d && d.type && d.no !== undefined ? this.game.find(d) : d);

		this.log.push({ type, data });
		if (this.subscriptions[type])
			this.subscriptions[type].slice().forEach(sub => sub.notify(type, datamap));
	}
}