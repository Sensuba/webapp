import Animation from './Animation';
import './Attack.css';

export default class Attack extends Animation {

	constructor (master, card) {

		super(master, 500);
		this.card = card;
	}

	run () {

		var el = document.getElementById("sensuba-card-" + this.card);
		if (el) {
			el.classList.add("sensuba-card-attack");
			setTimeout(() => el.classList.remove("sensuba-card-attack"), 1000);
		}
	}
}