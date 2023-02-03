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

	login (username, password) {

		this.socket.emit('identify', true, username, password);
		this.socket.on('identified', (key) => this.onIdentify(key));
	}

	setStatus (status) {

		this.status = status;
		this.onStatusChange(status);
	}

	gamemode (mode, params) {

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

	onConnect () {

		this.setStatus('connected');
		console.log('connected');
		this.socket.removeAllListeners('connected');
		this.socket.on('disconnect', this.onDisconnect.bind(this));
		this.login(0, 0);
	}

	onDisconnect () {


	}

	onIdentify (key) {

		this.socket.removeAllListeners('identified');
		console.log('identified as ' + key);
		this.socket.identified = true;
		localStorage.setItem('user', {key});
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