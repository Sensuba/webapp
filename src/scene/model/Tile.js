import Location from './Location.js';

const MAX_TILE_CHARACTERS = 2;

export default class Tile extends Location {

	layer = 3;

	maxcharacters = MAX_TILE_CHARACTERS;

	constructor (field, player, x) {

		super(player, "tile");
		if(!arguments.length) return;

		this.field = field;
		this.x = x;
	}

	get isFull() {

		return this.unitCount >= this.maxcharacters;
	}

	get opposite () {

		return this.player.opponent.tiles[this.x];
	}

	get units () {

		return this.cards.filter(unit => !unit.ghost)
	}

	get frontUnit () {

		let units = this.units;
		return units.length > 0 ? units[0] : undefined;
	}

	get backUnit () {

		let units = this.units;
		return units.length > 1 ? units[1] : undefined;
	}

	get unitCount () {

		return this.units.length;
	}

	get left () {

		if (this.x <= 0)
			return null;
		return this.player.tiles[this.x-1];
	}

	get right () {

		if (this.x >= 4)
			return null;
		return this.player.tiles[this.x+1];
	}

	get adjacents () {

		let adj = [];
		if (this.x > 0)
			adj.push(this.left);
		if (this.x < 4)
			adj.push(this.right);
		return adj;
	}

	canSwitch () {

		if (this.unitCount <= 1)
			return false;
		if (this.units.some(u => u.actioned))
			return false;
		return true;
	}

	switch () {

		if (this.unitCount <= 1)
			return;

		let index1 = this.cards.findIndex(unit => !unit.ghost);
		let index2 = this.cards.findLastIndex(unit => !unit.ghost, index1 + 1);
		
		this.game.notify("switch.before", this, this.cards[index1], this.cards[index2]);
		let tmp = this.cards[index1];
		this.cards[index1] = this.cards[index2];
		this.cards[index2] = tmp;
		this.game.notify("switch", this, this.cards[index2], this.cards[index1]);
	}

	serialize () {

		return {
			x: this.x,
			player: this.player.id.no,
			cards: this.cards.map(c => c.id.no)
		}
	}

	setup (game, data) {

		super.setup(game, data);
		this.field = this.game.field;
		this.x = data.x;
		this.player = game.find({type: "player", no: data.player});
	}
}