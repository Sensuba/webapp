import Player from './Player.js';
import Field from './Field.js';
import Tile from './Tile.js';
import Hand from './Hand.js';
import Deck from './Deck.js';
import Court from './Court.js';
import Stack from './Stack.js';
import Graveyard from './Graveyard.js';
import Discard from './Discard.js';
import Nether from './Nether.js';
import Capsule from './Capsule.js';
import Choosebox from './Choosebox.js';
import Card from './Card.js';
import Hero from './Hero.js';
import Throne from './Throne.js';
import Broadcaster from '../utility/Broadcaster.js';
import System from '../utility/System.js';

const P1_STARTING_HAND_SIZE = 4;
const P2_STARTING_HAND_SIZE = 5;

export default class Game {

	data = {};
	ids = {};
	players = [];
	auras = [];
	broadcaster = new Broadcaster(this);
	indexer = 1;
	boardindexer = 1;

	init (players) {

		this.register(this, "game");
		players.forEach(p => this.players.push(new Player(this, p.deck)));
		this.field = new Field(this);
		this.stack = new Stack(this);
		this.phase = "init";
	}

	start (player) {

		try {
			if (this.live)
				return;
			this.live = true;
			this.notify("start");
			this.turnPlayer =  player || this.players[Math.floor(Math.random()*this.players.length)];
			this.turnPlayer.opponent.addGems(1);
			this.turnPlayer.draw(P1_STARTING_HAND_SIZE);
			this.turnPlayer.opponent.draw(P2_STARTING_HAND_SIZE);
			this.turnPlayer.newTurn ();
		} catch (e) {
			this.abort(e);
		}
	}

	stop () {

		this.broadcaster.stop();
		this.stopped = true;
	}

	abort (error) {

		this.notify('error', error);
		this.stop();
	}

	register (item, type) {

		this.data[type] = this.data[type] || {};
		this.ids[type] = this.ids[type] || 0;
		let no = this.ids[type]++;
		item.id = {type, no};
		this.data[type][no] = item;
	}

	unregister (item) {

		let id = item.id;
		if (!id || !this.data[id.type] || !this.data[id.type][id.no])
			return;
		delete this.data[id.type][id.no];
		if (Object.keys(this.data[id.type]).length === 0)
			delete this.data[id.type];
		delete item.id;
	}

	subscribe (type, notify) {

		if (this.broadcaster)
			return this.broadcaster.subscribe(type, notify);
		return () => {};
	}

	find (id) {

		return id && this.data[id.type] ? this.data[id.type][id.no] : undefined;
	}

	notify (type, ...data) {

		switch (type) {
		case "herodestroy":
			this.stop();
			this.broadcaster.trigger(type, data);
			break;
		default:
			this.broadcaster.notify(type, data);
			break;
		}
	}

	update () {

		this.players.forEach(p => p.hand.cards.forEach(c => c.update()));
		this.players.forEach(p => p.hero.update());
		this.field.all.forEach(t => t.cards.forEach(c => c.update()));
		this.players.forEach(p => p.court.cards.forEach(c => c.update()));

		if (System.isServer && !this.broadcaster.locked) {
			let toDestroy = [];
			this.field.all.forEach(t => t.cards.forEach(c => {
				if (c.ghost && !c.sentenced)
					toDestroy.push(c);
			}));
			if (toDestroy.length > 0) {
				this.broadcaster.lock();
				toDestroy.forEach(c => c.destroy());
				this.broadcaster.unlock();
			}
		}
	}

	index (card) {

		card.index = this.indexer++;
	}

	boardIndex (card) {

		card.boardIndex = this.boardindexer++;
	}

	addAura (aura) {

		this.auras.push(aura);
	}

	clearAura (aura) {

		this.auras = this.auras.filter(a => a !== aura)
	}

	serialize () {

		let res = {};
		res.game = {
			ids: this.ids,
			players: this.players.map(p => p.id.no),
			turnPlayer: this.turnPlayer ? this.turnPlayer.id.no : undefined,
			phase: this.phase,
			field: this.field.id.no,
			stack: this.stack.id.no,
			live: this.live,
			indexer: this.indexer
		}
		Object.keys(this.data).forEach(type => {
			if (type === "game")
				return;
				res[type] = {};
				Object.keys(this.data[type]).forEach(no => res[type][no] = this.data[type][no].serialize());
		})
		return res;
	}

	static build (gamestate) {

		let game = new Game();
		game.data.game = {0: game};
		game.id = {type: "game", no: 0};
		Object.assign(game.ids, gamestate.game.ids);
		Object.keys(gamestate).forEach(type => {
			if (type === "game")
				return;
			game.data[type] = {};
			let maker;
			switch (type) {
			case "player": maker = () => new Player(); break;
			case "deck": maker = () => new Deck(); break;
			case "hand": maker = () => new Hand(); break;
			case "court": maker = () => new Court(); break;
			case "stack": maker = () => new Stack(); break;
			case "graveyard": maker = () => new Graveyard(); break;
			case "discard": maker = () => new Discard(); break;
			case "nether": maker = () => new Nether(); break;
			case "capsule": maker = () => new Capsule(); break;
			case "choosebox": maker = () => new Choosebox(); break;
			case "card": maker = () => new Card(); break;
			case "throne": maker = () => new Throne(); break;
			case "hero": maker = () => new Hero(); break;
			case "field": maker = () => new Field(); break;
			case "tile": maker = () => new Tile(); break;
			default: return;
			}
			Object.keys(gamestate[type]).forEach(no => {
				let item = maker();
				item.id = {type, no};
				game.data[type][no] = item;
			})
		})
		game.phase = gamestate.game.phase;
		game.live = gamestate.game.live;
		game.indexer = gamestate.game.indexer;
		game.field = game.data.field[gamestate.game.field];
		game.stack = game.data.stack[gamestate.game.stack];
		game.players = gamestate.game.players.map(no => game.data.player[no]);
		if (gamestate.game.turnPlayer)
			game.turnPlayer = game.data.player[gamestate.game.turnPlayer];
		Object.keys(gamestate).forEach(type => {
			if (type === "game")
				return;
			Object.keys(gamestate[type]).forEach(no => {
				game.data[type][no].setup(game, gamestate[type][no]);
			})
		});
		game.update();
		return game;
	}
}