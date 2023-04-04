import Animation from './Animation';

export default class ShieldBreak extends Animation {

	constructor (master, card) {

		super(master, 0);
		this.card = card;
		this.loadAudio("shieldbreak");
	}

	run () {

	}
}