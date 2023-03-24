import Animation from './Animation';
import './Heal.css';

export default class Heal extends Animation {

	constructor (master, card, value) {

		super(master, 0);
		this.card = card;
		this.value = value;
		this.loadAudio("heal");
	}

	run () {

		var el = this.card.type === "hero" ? document.getElementById("sensuba-hero-" + this.card.no) : document.getElementById("sensuba-card-" + this.card.no);
		if (el) {
			el.classList.add("sensuba-card-heal");
			setTimeout(() => el.classList.remove("sensuba-card-heal"), 1000);
			document.querySelector((this.card.type === "hero" ? "#sensuba-hero-" : "#sensuba-card-") + this.card.no + " .game-digitanim").innerHTML = this.value ? this.value : null;
		}
	}
}