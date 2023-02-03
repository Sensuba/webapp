import System from '../utility/System.js';

export default class Listener {

	constructor (src, subscribe, system) {
		
		this.src = src;

		if (!subscribe)
			return;
		this.subscribe = subscribe;
		this.system = system;
		this.unsubscribe = () => {};
		this.activated = false;
		if (src.activated)
			this.activate();
	}

	init (subscribe, system) {
		
		this.subscribe = subscribe;
		this.system = system;
		this.unsubscribe = () => {};
		this.activated = false;
		if (this.src.activated)
			this.activate();
	}

	activate () {

		if (!System.isServer && !this.system)
			return;
		if (this.activated)
			return;
		this.unsubscribe = this.subscribe(this.src);
		this.activated = true;
	}

	deactivate () {

		if (!System.isServer)
			return;
		if (!this.activated)
			return;
		this.unsubscribe();
		this.activated = false;
	}

	copy (src) {

		return new Listener(src, this.subscribe);
	}
}