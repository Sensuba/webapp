import io from 'socket.io-client';

const serverURL = /*process.env.SERVER_URL ||*/ 'http://localhost:8080';
let master;

export default class SocketManager {

	constructor () {

		this.status = 'disconnected';
    	this.socket = { connected: false, removeAllListeners: () => {}, emit: () => {}, on: () => {}, close: () => {} };
	}

	start () {

		this.setStatus('connecting');
		console.log('connecting to server...')
		this.socket = io.connect(serverURL);
		this.attemps = 0;
		this.socket.on('connected', this.onConnect.bind(this));

	}

	login (username, password, callback) {

		this.socket.emit('identify', true, username, password);
		this.socket.on('identified', (key, user) => this.onIdentify(key, user, callback));
	}

	logout () {

		localStorage.removeItem('user');
		localStorage.removeItem('decks');
		this.socket.emit('identify', false);
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
	}

	exitGame () {

		this.socket.emit('exitgame');
		this.socket.removeAllListeners('gameupdate');
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
		this.loading = [0, 4];
	}

	command (command, ...params) {

		this.socket.emit('gamecommand', command, params);
	}

	deckbuild (command, ...params) {

		this.socket.emit('deckbuild', command, params);
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
		this.socket.on('deckbuild', this.onDeckbuild.bind(this));
		localStorage.setItem('user', JSON.stringify(data.user));
		localStorage.setItem('decks', JSON.stringify(data.decks));
		if (callback)
			callback(data.user.anonymous !== true);
	}

	onDeckbuild (command, params) {

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
			localStorage.setItem('decks', JSON.stringify(decks));
			if (this.onDeckbuildUpdate)
				this.onDeckbuildUpdate(targetdeck);
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
			localStorage.setItem('decks', JSON.stringify(decks));
			if (this.onDeckbuildUpdate)
				this.onDeckbuildUpdate(targetdeck);
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
			localStorage.setItem('decks', JSON.stringify(decks));
			if (this.onDeckbuildUpdate)
				this.onDeckbuildUpdate(targetdeck);
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
			localStorage.setItem('decks', JSON.stringify(decks));
			if (this.onDeckbuildUpdate)
				this.onDeckbuildUpdate(targetdeck);
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

	onStatusChange (status) {}
	onGameupdate (type, data) {}

	static get master () {

		if (!master)
			master = new SocketManager();
		return master;
	}
}