import Animation from './Animation';
import './Target.css';

export default class Target extends Animation {

	constructor (master, card) {

		super(master, 1200);
		this.card = card;
	}

	run () {

		var el = document.getElementById("sensuba-" + this.card.type + "-" + this.card.no);
		if (el) {
			setTimeout(() => el.classList.add("sensuba-card-target"), 10);
			setTimeout(() => el.classList.remove("sensuba-card-target"), 1200);
		}
	}
}