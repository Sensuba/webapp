import System from '../utility/System.js';

export default class Listener {

	constructor (src, subscribe) {
		
		this.src = src;
		this.subscribe = subscribe;
		this.unsubscribe = () => {};
		this.activated = false;
		if (src.activated)
			this.activate();
	}

	activate () {

		if (!System.isServer)
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