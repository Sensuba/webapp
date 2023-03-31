import Animation from './Animation';
import './Target.css';

export default class Target extends Animation {

	constructor (master, card) {

		super(master, 1200);
		this.card = card;
	}

	run () {

		var el = document.getElementById("sensuba-card-" + this.card);
		if (el) {
			el.classList.add("sensuba-card-target");
			setTimeout(() => el.classList.remove("sensuba-card-target"), 1200);
		}
	}
}