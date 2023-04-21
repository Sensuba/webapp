import Animation from './Animation';
import './RemoveFromHand.css';

export default class RemoveFromHand extends Animation {

	constructor (master, card) {

		super(master, 300);
		this.card = card;
		//this.loadAudio("trigger");
	}

	run () {

		var el = document.querySelector("#sensuba-card-" + this.card);
		if (el) {
			el.classList.add("remove-from-hand-anim");
			//setTimeout(() => el.classList.remove("remove-from-hand-anim"), 300);
		}
	}
}