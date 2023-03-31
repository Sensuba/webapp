import { play } from '../../../SoundManager';

export default class Animation {

	constructor (master, time, before, callback) {

		this.master = master;
		this.time = time;
		this.before = before;
		this.callback = callback;
	}

	loadAudio (name, delay) {

		this.audio = name;
		if (delay)
			this.audioDelay = delay;
	}

	start (update) {
		
		if (this.audioDelay)
			setTimeout(() => {
				play(this.audio, 'sfx', 'scene');
			}, this.audioDelay)
		else if (this.audio) {
			play(this.audio, 'sfx', 'scene');
		}
		this.run();

		if (this.sync && update)
			setTimeout(() => {
				update();
				if (this.callback)
					this.callback();
			}, this.time);
		else {
			if (update)
				update();
			if (this.callback)
				this.callback();
		}
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