
export default class Controller {

	constructor (player) {

		this.game = player.game;
		this.player = player;
	}

	get priority () {

		return this.player.priority;
	}

	get playing () {

		return this.player.playing;
	}

	draw () {

		if (!this.playing)
			return;
		if (!this.player.tryToPay(1))
			return;
		this.player.draw();
		this.player.endTurn();
	}

	channel () {

		if (!this.playing)
			return;
		this.player.channel();
		this.player.endTurn();
	}

	play (card, target) {

		if (!this.playing)
			return;
		card = this.game.find(card);
		if (!card)
			return;
		target = target ? {tile: this.game.find(target.tile), rotation: target.rotation} : undefined;
		if (!this.player.tryToPlay(card, target))
			return;
		this.player.endTurn();
	}
}