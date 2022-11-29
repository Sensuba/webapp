
export default class Types {

	static string (value, src) {

		return value;
	}

	static int (value, src) {

		return typeof value === 'string' ? parseInt(value, 10) : value;
	}

	static bool (value, src) {

		return (typeof value === 'string' ? (value === "true" ? true : false) : value) || false;
	}

	static player (value, src) {

		return typeof value === 'string' ? (value === "self" ? src.player : src.player.opposite) : value;
	}

	static event (value, src) {

		return typeof value === 'string' ? () => {} : value;
	}

	static data (value, src) {

		return value || [];
	}

	static card (value, src) {

		if (!(typeof value === 'string'))
			return value;
		switch (value) {
		case 'this': return src;
		case 'your hero': return src.player.hero;
		case 'enemy hero': return src.player.opponent.hero;
		default: return src;
		}
	}

	static location (value, src) {

		if (!(typeof value === 'string'))
			return value;
		switch (value) {
		case 'this': return src.location;
		case 'your hand': return src.player.hand;
		case 'enemy hand': return src.player.opponent.hand;
		case 'your deck': return src.player.deck;
		case 'enemy deck': return src.player.opponent.deck;
		case 'your throne': return src.player.throne;
		case 'enemy throne': return src.player.opponent.throne;
		default: return null;
		}
	}

	static locations (value, src) {

		if (!(typeof value === 'string'))
			return value;
		switch (value) {
		case 'this': return [src.location];
		case 'field': return src.game.field.all;
		case 'your field': return src.player.tiles;
		case 'enemy field': return src.player.opponent.tiles;
		case 'your hand': return [src.player.hand];
		case 'enemy hand': return [src.player.opponent.hand];
		case 'your deck': return [src.player.deck];
		case 'enemy deck': return [src.player.opponent.deck];
		case 'your throne': return [src.player.throne];
		case 'enemy throne': return [src.player.opponent.throne];
		case 'your field and throne': return src.player.tiles.concat([src.player.throne]);
		case 'enemy field and throne': return src.player.opponent.tiles.concat([src.player.opponent.throne]);
		case 'your court': return [src.player.court];
		case 'enemy court': return [src.player.opponent.court];
		default: return null;
		}
	}

	static column (value, src) {
		
		if (!(typeof value === 'string'))
			return value;
		switch (value) {
		case 'this': return src.onField ? src.location.x : 2;
		case 'middle': return 2;
		case 'left': return 0;
		case 'midleft': return 1;
		case 'right': return 4;
		case 'midright': return 3;
		default: return 2;
		}
	}

	static cardfilter (value, src) {

		if (!(typeof value === 'string'))
			return value;
		switch (value) {
		case 'hero': return (csrc, card) => card.isHero;
		case 'unit': return (csrc, card) => card.isUnit;
		case 'friendly unit': return (csrc, card) => csrc.player === card.player && card.isUnit;
		case 'enemy unit': return (csrc, card) => card.player && csrc.player !== card.player && card.isUnit;
		case 'character': return (csrc, card) => card.isCharacter;
		case 'friendly character': return (csrc, card) => csrc.player === card.player && card.isCharacter;
		case 'enemy character': return (csrc, card) => card.player && csrc.player !== card.player && card.isCharacter;
		case 'spell': return (csrc, card) => card.isSpell;
		default: return (csrc, card) => true;
		}
	}

	static tilefilter (value, src) {

		if (!(typeof value === 'string'))
			return value;
		switch (value) {
		case 'this': return (csrc, tile) => csrc.onField && csrc.location === tile;
		case 'not this': return (csrc, tile) => csrc.location !== tile;
		case 'friendly': return (csrc, tile) => csrc.player === tile.player;
		case 'enemy': return (csrc, tile) => csrc.player !== tile.player;
		case 'empty': return (csrc, tile) => tile.isEmpty;
		case 'not empty': return (csrc, tile) => !tile.isEmpty;
		case 'full': return (csrc, tile) => tile.isFull;
		case 'not full': return (csrc, tile) => !tile.isFull;
		default: return (csrc, tile) => true;
		}
	}

	static columnfilter (value, src) {

		if (!(typeof value === 'string'))
			return value;
		switch (value) {
		case 'any': return (csrc, column) => true;
		case 'empty': return (csrc, column) => csrc.player.tiles[column].isEmpty && csrc.player.opponent.tiles[column].isEmpty;
		case 'your side empty': return (csrc, column) => csrc.player.tiles[column].isEmpty;
		case 'enemy side empty': return (csrc, column) => csrc.player.opponent.tiles[column].isEmpty;
		case 'your side not full': return (csrc, column) => !csrc.player.tiles[column].isFull;
		case 'enemy side not full': return (csrc, column) => !csrc.player.opponent.tiles[column].isFull;
		default: return (csrc, column) => true;
		}
	}

	static timestamp (value, src) {

		return value;
	}

	static booster (value, src) {

		return value;
	}
}