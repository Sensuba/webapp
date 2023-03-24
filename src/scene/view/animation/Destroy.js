import Animation from './Animation';
import './Destroy.css';

export default class Destroy extends Animation {

	constructor (master, card) {

		super(master, 400);
		this.card = card;
		this.loadAudio("destroy");
	}

	run () {

		var el = document.getElementById("sensuba-card-" + this.card);
		if (el) {
			el.classList.add("sensuba-card-destroy");
			setTimeout(() => el.classList.remove("sensuba-card-destroy"), 400);
		}
	}
}