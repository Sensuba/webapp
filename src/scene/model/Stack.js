import Location from './Location.js';

export default class Stack extends Location {

	layer = 3;

	waitingList = [];

	constructor (player) {

		super(player, "stack");
		if(!arguments.length) return;
	}

	cast (player, card, target) {

		this.applyAuras(player, card);
		if (!this.resolving)
			this.resolve(player, card, target);
		else {
			card.goto(this);
			this.waitingList[this.resolving-1].push({card, player, target});
		}
	}

	resolve (player, card, target) {

		this.waitingList.push([]);
		this.resolving = this.waitingList.length;
		card.goto(player.court);
		let targetdata = target ? target.data : undefined;
		this.game.notify("cast.before", card, player, targetdata);
		if (card.events)
			for (let i = 0; i <= (card.extratriggers || 0); i++)
				card.events.forEach(e => e(targetdata));
		this.game.notify("cast", this, player, targetdata);
		card.goto(player.graveyard);
		this.waitingList[this.resolving-1].forEach(r => this.resolve(r.player, r.card, r.target));
		this.waitingList.pop();
		delete this.resolving;
	}

	applyAuras (player, card) {

		let eff = card.eff;
		/*this.game.sauras.forEach(aura => {
			if (aura.applicable(card, player))
				eff = aura.apply(eff);
		});*/
		card.mana = eff.mana;
	}

	serialize () {

		return {
			cards: this.cards.map(c => c.id.no),
			waitingList: this.waitingList.map(priority => priority.map(r => ({card: r.card.id.no, player: r.player.id.no, target: r.target ? {type: r.target.type, data: r.target.type === "card" ? r.target.data.id : r.target.data} : undefined})))
		}
	}

	setup (game, data) {
		
		super.setup(game, data);
		this.waitingList = data.waitingList.map(priority => priority.map(r => ({card: game.find({type: "card", no: r.card}), player: game.find({type: "player", no: r.player}), target: r.target ? {type: r.target.type, data: r.target.type === "card" ? game.find({type: "card", no: r.target.data}) : r.target.data} : undefined})));
	}
}