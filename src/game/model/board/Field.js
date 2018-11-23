import Tile from "./Tile";

export default class Field {

	constructor (area) {

		this.id = { type: "field", "no": area.id.no };
		area.gameboard.register(this);

		this.area = area;
		this.tiles = [];
		for (var i = 0; i < 9; i++)
			this.tiles.push(new Tile(i + 9 * this.id.no, this));
	}

	get front () {

		return this.tiles.slice(0, 4);
	}

	get back () {

		return this.tiles.slice(4, 9);
	}

	get opposite () {

		return this.area.opposite.field;
	}
}