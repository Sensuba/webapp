import Animation from './Animation';
import './Listener.css';

export default class Listener extends Animation {

	constructor (master, card) {

		super(master, 500);
		this.card = card;
		this.loadAudio("listener");
	}

	run () {

		var el = document.querySelector("#sensuba-card-" + this.card);
		if (el) {
			el.classList.add("sensuba-card-blink");
			setTimeout(() => el.classList.remove("sensuba-card-blink"), 800);
		}
	}
}