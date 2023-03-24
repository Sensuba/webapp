import Animation from './Animation';
import './Damage.css';

export default class Damage extends Animation {

	constructor (master, card, value) {

		super(master, 0);
		this.card = card;
		this.value = value;
		this.loadAudio("damage");
	}

	run () {

		var el = this.card.type === "hero" ? document.getElementById("sensuba-hero-" + this.card.no) : document.getElementById("sensuba-card-" + this.card.no);
		if (el) {
			this.master.damageAnim = this.master.damageAnim || {};
			this.master.damageAnim[this.card.type + this.card.no] = this;
			if (el.classList.contains("sensuba-card-damage"))
				el.classList.remove("sensuba-card-damage");
			el.classList.add("sensuba-card-damage");
			setTimeout(() => {
				if (this.master.damageAnim[this.card.type + this.card.no] === this) {
					el.classList.remove("sensuba-card-damage");
					delete this.master.damageAnim[this.card.type + this.card.no];
				}
			}, 600);
			document.querySelector((this.card.type === "hero" ? "#sensuba-hero-" : "#sensuba-card-") + this.card.no + " .game-digitanim").innerHTML = this.value;
		}
	}
}