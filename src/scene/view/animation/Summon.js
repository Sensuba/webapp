import Animation from './Animation';
import './Summon.css';

export default class Summon extends Animation {

	constructor (master, card) {

		super(master, 0);
		this.card = card;
		this.loadAudio("summon");
	}

	run () {

		setTimeout(() => {
		var el = document.querySelector("#sensuba-card-" + this.card);
		if (el) {
			el.classList.add("sensuba-card-summon");
			setTimeout(() => {
				el.classList.remove("sensuba-card-summon");
				el.classList.add("sensuba-card-summoned")
			}, 600);
		}}, 1)
	}
}