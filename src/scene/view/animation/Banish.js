import Animation from './Animation';
import './Banish.css';

export default class Banish extends Animation {

	constructor (master, card) {

		super(master, 250);
		this.card = card;
		//this.loadAudio("destroy");
	}

	run () {

		var el = document.getElementById("sensuba-card-" + this.card);
		if (el) {
			el.classList.add("sensuba-card-banish");
			//setTimeout(() => el.classList.remove("sensuba-card-destroy"), 400);
		}
	}
}