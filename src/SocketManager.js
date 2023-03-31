import io from 'socket.io-client';

const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:8080';
let master;

export default class SocketManager {

	constructor () {

		this.status = 'disconnected';
    	this.socket = { connected: false, removeAllListeners: () => {}, emit: () => {}, on: () => {}, close: () => {} };
	}

	start () {

		this.setStatus('connecting');
		console.log('connecting to server...');
		this.socket = io.connect(serverURL);
		this.attemps = 0;
		this.socket.on('connected', this.onConnect.bind(this));
		this.socket.on('kick', this.onKick.bind(this));
	}

	login (username, password, callback) {

		this.socket.emit('identify', true, username, password);
		this.socket.on('identified', (key, user) => this.onIdentify(key, user, callback));
	}

	logout () {

		localStorage.removeItem('user');
		localStorage.removeItem('decks');
		this.socket.emit('logout');
		window.location.reload(false);
	}

	signup (username, password, callback) {

		this.socket.emit('signup', username, password);
		this.socket.on('identified', (key, user) => this.onIdentify(key, user, callback));
	}

	setStatus (status) {

		this.status = status;
		this.onStatusChange(status);
	}

	gamemode (mode, ...params) {

		this.socket.emit('gamemode', mode, params);
		this.socket.on('gameupdate', (type, data) => this.onGameupdate(type, data));
		this.socket.on('failed', (err) => this.onFail(err));
	}

	exitGame () {

		this.socket.emit('exitgame');
		this.socket.removeAllListeners('gameupdate');
		this.socket.removeAllListeners('failed');
		this.onGameupdate = (type, data) => {};
		this.onFail = (err) => {};
	}

	getLibraryVersion (callback) {

		this.socket.emit('getlibraryversion');
		this.socket.on('libraryversion', version => {
			callback(version);
			this.socket.removeAllListeners('libraryversion');
		})
	}

	loadLibrary (language) {

		this.socket.emit('loadlibrary', language);
		this.socket.on('updateversion', cards => this.onUpdateVersion(cards));
		this.socket.on('updatecards', cards => this.onUpdateCards(cards));
		this.socket.on('updateheroes', heroes => this.onUpdateHeroes(heroes));
		this.socket.on('updateterrains', terrains => this.onUpdateTerrains(terrains));
		this.socket.on('updateportals', portals => this.onUpdatePortals(portals));
		this.loading = [0, 5];
	}

	command (command, ...params) {

		this.socket.emit('gamecommand', command, params);
	}

	deckbuild (command, ...params) {

		this.socket.emit('deckbuild', command, params);
	}

	portal (command, ...params) {

		this.socket.emit('portal', command, params);
	}

	onConnect () {

		this.setStatus('connected');
		console.log('connected');
		this.socket.removeAllListeners('connected');
		this.socket.on('disconnect', this.onDisconnect.bind(this));
		let user = JSON.parse(localStorage.getItem('user'));
		if (user && user.accesstoken)
			this.socket.emit('identify', false, user.key, user.accesstoken);
		else this.socket.emit('identify', false);
		this.socket.on('identified', (key, user) => this.onIdentify(key, user));
	}

	onDisconnect () {

		this.status = 'disconnected';
		if (this.socket)
			this.socket.disconnect();
    	this.socket = { connected: false, removeAllListeners: () => {}, emit: () => {}, on: () => {}, close: () => {} };
    	console.log('lost connexion');
    	this.onStatusChange(this.status);
	}

	onKick (key) {

		setTimeout(() => {
			let user = localStorage.getItem('user');
			if (user) {
				user = JSON.parse(user);
				if (user && user.key !== key)
					return;
			}window.location.reload(false);
		}, 100)
	}

	onIdentify (code, data, callback) {

		this.socket.removeAllListeners('identified');

		if (code <= 0) {
			console.log('failed to identify');
			return;
		}

		console.log('identified as ' + (data.user.anonymous ? 'anonymous user ' + data.user.key : data.user.username));
		this.socket.identified = true;
		this.socket.removeAllListeners('deckbuild');
		this.socket.removeAllListeners('reward');
		this.socket.removeAllListeners('action');
		this.socket.on('deckbuild', this.onDeckbuild.bind(this));
		this.socket.on('reward', this.onReward.bind(this));
		this.socket.on('action', this.onAction.bind(this));
		localStorage.setItem('user', JSON.stringify(data.user));
		localStorage.setItem('decks', JSON.stringify(data.decks));
		localStorage.setItem('collection', JSON.stringify(data.collection));
		if (callback)
			callback(data.user.anonymous !== true);
	}

	onAction (type, params, main=true) {

		switch (type) {
		case "updatecredits": {
			let user = JSON.parse(localStorage.getItem('user'));
			user.runes = params[0];
			user.shards = params[1];
			if (main) {
				localStorage.setItem('user', JSON.stringify(user));
				this.onCreditUpdate(params[0], params[1]);
			} else
				setTimeout(() => this.onCreditUpdate(params[0], params[1]), 100)
			break;
		}
		case "exploreportal": {
			let user = JSON.parse(localStorage.getItem('user'));
			user.exploration = params[0];
			if (main) {
				localStorage.setItem('user', JSON.stringify(user));
				this.onExplorePortal(params[0]);
			} else
				setTimeout(() => this.onExplorePortal(params[0]), 100)
			break;
		}
		default: break;
		}
	}

	onDeckbuild (command, params, main=true) {

		switch (command) {
		case "newdeck": {
			let decks = JSON.parse(localStorage.getItem('decks'));
			let targetdeck = {
				key: params[2],
				author: params[3],
				deckname: params[0],
				body: {
					hero: params[1],
					cards: []
				}
			}
			decks.push(targetdeck);
			if (main) {
				localStorage.setItem('decks', JSON.stringify(decks));
				this.onDeckbuildUpdate(targetdeck)
			} else
				setTimeout(() => this.onDeckbuildUpdate(targetdeck), 100);
			break;
		}
		case "delete": {
			let decks = JSON.parse(localStorage.getItem('decks'));
			decks = decks.filter(deck => deck.key !== params[0]);
			if (main)
				localStorage.setItem('decks', JSON.stringify(decks));
			let validDecks = decks.filter(deck => deck.body.cards.length === 30);
			let activeDeck = localStorage.getItem('activedeck');
			if (main && activeDeck && !validDecks.map(deck => deck.key).includes(activeDeck))
				localStorage.removeItem('activedeck');
			if (main)
				this.onDeckbuildUpdate(null)
			else
				setTimeout(() => this.onDeckbuildUpdate(null), 100);
			break;
		}
		case "rename": {
			let decks = JSON.parse(localStorage.getItem('decks'));
			let targetdeck;
			decks.forEach(deck => {
				if (deck.key === params[0]) {
					targetdeck = deck;
					deck.deckname = params[1];
				}
			})
			if (main)
				localStorage.setItem('decks', JSON.stringify(decks));
			let validDecks = decks.filter(deck => deck.body.cards.length === 30);
			let activeDeck = localStorage.getItem('activedeck');
			if (main && activeDeck && !validDecks.map(deck => deck.key).includes(activeDeck))
				localStorage.removeItem('activedeck');
			if (main)
				this.onDeckbuildUpdate(targetdeck)
			else
				setTimeout(() => this.onDeckbuildUpdate(targetdeck), 100);
			break;
		}
		case "addcard": {
			let decks = JSON.parse(localStorage.getItem('decks'));
			let targetdeck;
			decks.forEach(deck => {
				if (deck.key === params[0]) {
					targetdeck = deck;
					deck.body.cards.push(params[1]);
				}
			})
			if (main)
				localStorage.setItem('decks', JSON.stringify(decks));
			let validDecks = decks.filter(deck => deck.body.cards.length === 30);
			let activeDeck = localStorage.getItem('activedeck');
			if (main && activeDeck && !validDecks.map(deck => deck.key).includes(activeDeck))
				localStorage.removeItem('activedeck');
			if (main)
				this.onDeckbuildUpdate(targetdeck)
			else
				setTimeout(() => this.onDeckbuildUpdate(targetdeck), 100);
			break;
		}
		case "removecard": {
			let decks = JSON.parse(localStorage.getItem('decks'));
			let targetdeck;
			decks.forEach(deck => {
				if (deck.key === params[0]) {
					targetdeck = deck;
					let idx = deck.body.cards.findIndex(key => key === params[1]);
					if (idx >= 0)
						deck.body.cards.splice(idx, 1);
				}
			})
			if (main)
				localStorage.setItem('decks', JSON.stringify(decks));
			let validDecks = decks.filter(deck => deck.body.cards.length === 30);
			let activeDeck = localStorage.getItem('activedeck');
			if (main && activeDeck && !validDecks.map(deck => deck.key).includes(activeDeck))
				localStorage.removeItem('activedeck');
			if (main)
				this.onDeckbuildUpdate(targetdeck)
			else
				setTimeout(() => this.onDeckbuildUpdate(targetdeck), 100);
			break;
		}
		default: break;
		}
	}

	onReward (type, data, main=true) {

		switch (type) {
		case "openportal": {
			let newcards = data.filter(d => d.type === "card").map(d => d.key);
			let collection;
			if (newcards.length > 0) {
				collection = JSON.parse(localStorage.getItem('collection'));
				newcards.forEach(card => collection.cards.push(card));
				if (main)
					localStorage.setItem('collection', JSON.stringify(collection));
			}
			if (main)
				this.onCollectionUpdate(collection, data);
			else if (newcards.length > 0)
				setTimeout(() => this.onCollectionUpdate(collection), 100);

			let shards = data.filter(d => d.type === "shards").reduce((acc, d) => acc + d.value, 0);
			if (shards) {
				let user = JSON.parse(localStorage.getItem('user'));
				user.shards += shards;
				if (main) {
					localStorage.setItem('user', JSON.stringify(user));
					this.onCreditUpdate(user.runes, user.shards);
				} else
					setTimeout(() => this.onCreditUpdate(user.runes, user.shards), 100);
			}
			break;
		}
		default: break;
		}
	}



	onUpdateVersion (version) {

		localStorage.setItem('library.version', version);
		this.socket.removeAllListeners('updateversion');
		this.loading[0]++;
		this.onUpdateLibrary(this.loading[0], this.loading[1]);
	}

	onUpdateCards (cards) {

		localStorage.setItem('library.cards', JSON.stringify(cards));
		localStorage.setItem('library.cards.version', parseInt(localStorage.getItem('library.cards.version') || "0", 10)+1);
		this.socket.removeAllListeners('updatecards');
		this.loading[0]++;
		this.onUpdateLibrary(this.loading[0], this.loading[1]);
	}

	onUpdateHeroes (heroes) {

		localStorage.setItem('library.heroes', JSON.stringify(heroes));
		localStorage.setItem('library.heroes.version', parseInt(localStorage.getItem('library.heroes.version') || "0", 10)+1);
		this.socket.removeAllListeners('updateheroes');
		this.loading[0]++;
		this.onUpdateLibrary(this.loading[0], this.loading[1]);
	}

	onUpdateTerrains (terrains) {

		localStorage.setItem('library.terrains', JSON.stringify(terrains));
		localStorage.setItem('library.terrains.version', parseInt(localStorage.getItem('library.terrains.version') || "0", 10)+1);
		this.socket.removeAllListeners('updateterrains');
		this.loading[0]++;
		this.onUpdateLibrary(this.loading[0], this.loading[1]);
	}

	onUpdatePortals (portals) {

		localStorage.setItem('library.portals', JSON.stringify(portals));
		localStorage.setItem('library.portals.version', parseInt(localStorage.getItem('library.portals.version') || "0", 10)+1);
		this.socket.removeAllListeners('updateportals');
		this.loading[0]++;
		this.onUpdateLibrary(this.loading[0], this.loading[1]);
	}

	onStatusChange (status) {}
	onGameupdate (type, data) {}
	onDeckbuildUpdate (targetdeck) {}
	onCollectionUpdate (collection) {}
	onCreditUpdate (runes, shards) {}
	onExplorePortal (explore) {}
	onFail (err) {}

	static get master () {

		if (!master)
			master = new SocketManager();
		return master;
	}
}