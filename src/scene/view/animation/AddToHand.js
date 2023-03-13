import Animation from './Animation';
import './AddToHand.css';

export default class AddToHand extends Animation {

	constructor (master, card) {

		super(master, 300);
		this.card = card;
		this.loadAudio("draw");
	}

	run () {

		/*var el = document.querySelector("#wanderaft-card-" + this.card);
		if (el) {
			el.classList.add("add-to-hand-anim");
			setTimeout(() => el.classList.remove("add-to-hand-anim"), 400);
		}*/
	}
}