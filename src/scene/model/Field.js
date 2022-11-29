var Tile = require("./Tile");

class Field {

	tiles = [[], []];

	constructor (game) {

		if(!arguments.length) return;

		this.game = game;
		this.game.register(this, "field");
		for (let p = 0; p < 2; p++) {
			for (let i = 0; i < 5; i++)
				this.tiles[p].push(new Tile(this, this.game.players[p], i))
		}
	}

	get columns () { return [0, 1, 2, 3, 4] }

	get all () { return this.tiles[0].concat(this.tiles[1]) }

	get units () { return this.all.reduce((acc, e) => acc.concat(e.cards), []) }

	serialize () {

		return {
			tiles: this.tiles.map(p => p.map(t => t.id.no))
		}
	}

	setup (game, data) {

		this.game = game;
		for (let p = 0; p < 2; p++) 
			this.tiles[p] = data.tiles[p].map(no => this.game.find({type: "tile", no}));
	}
}

module.exports = Field;