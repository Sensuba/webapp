export default class Animation {

	constructor (master, time, before) {

		this.master = master;
		this.time = time;
		this.before = before;
	}

	loadAudio (name, delay) {

		this.audio = new Audio("/audio/sfx/" + name + ".ogg");
		this.audio.setAttribute("type", "audio/ogg");
		if (delay)
			this.audioDelay = delay;
	}

	start (update) {
		
		if (this.audioDelay)
			setTimeout(() => {
				if (!this.master.mute && this.audio) {
					this.audio.volume = this.master.volume;
					this.audio.play();
				}
			}, this.audioDelay)
		else if (!this.master.mute && this.audio) {
			this.audio.volume = this.master.volume;
			this.audio.play();
		}
		this.run();

		if (this.sync && update)
			setTimeout(update, this.time);
		else if (update)
			update();
	}

	run () {

	}

	async () {

		this.time = 0;
	}

	get sync () {

		return this.time > 0;
	}
}