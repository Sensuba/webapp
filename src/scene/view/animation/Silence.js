import Animation from './Animation';
import './Silence.css';

export default class Silence extends Animation {

	constructor (master, card) {

		super(master, 0);
		this.card = card;
		this.loadAudio("silence");
	}

	run () {

		var el = document.querySelector("#sensuba-card-" + this.card);
		if (el) {
			el.classList.add("sensuba-card-silence");
			setTimeout(() => el.classList.remove("sensuba-card-silence"), 1000);
		}
	}
}