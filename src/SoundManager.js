let audioLibrary = {
	music: {},
	sfx: {}
}

let volume = { music: localStorage.getItem('volume.music'), sfx: localStorage.getItem('volume.sfx') }
let currentMusic = null;

let adjustedVolume = type => Math.pow(volume[type], 1.5);

let stopMusic = () => {

	if (currentMusic) {
		let audio = currentMusic;
		currentMusic = null;
		let multiplier = 1;
		let fadeout = setInterval(
		  function() {
		  	if (currentMusic === audio)
		  		clearInterval(fadeout);
		    else if (multiplier > 0) {
		      multiplier = Math.max(multiplier - 0.05, 0);
		      audio.volume = adjustedVolume('music') * multiplier;
		    }
		    else {
		      audio.pause();
		      clearInterval(fadeout);
		    }
		  }, 80);
	}
}

let stopCategory = (category) => {

	Object.keys(audioLibrary).forEach(type => Object.keys(audioLibrary[type]).forEach(name => {
		if (!audioLibrary[type][name].paused && audioLibrary[type][name].category === category)
			audioLibrary[type][name].pause();
	}))
}

let play = (name, type, category) => {

	let audio = audioLibrary[type][name];
	if (!audio) {
		audio = new Audio("/audio/" + type + "/" + name + ".ogg");
		audio.volume = adjustedVolume(type);
		audio.category = category;
		audioLibrary[type][name] = audio;
	} else if (currentMusic === audio)
		return;
	switch (type) {
	case 'music': {
		stopMusic();
		audio.loop = true;
		audio.volume = 0;
		currentMusic = audio;
		let multiplier = 0;
		let fadeout = setInterval(
		  function() {
		  	if (currentMusic !== audio)
		  		clearInterval(fadeout);
		    else if (multiplier < 1) {
		      multiplier = Math.min(multiplier + 0.05, 1);
		      audio.volume = adjustedVolume('music') * multiplier;
		    }
		    else {
		      clearInterval(fadeout);
		    }
		  }, 80);
	}
	default: break;
	}
	audio.currentTime = 0;
	audio.play();
}

let getVolume = (type) => volume[type];

let setVolume = (vol, type) => {

	localStorage.setItem('volume.' + type, vol);
	volume[type] = vol;
	Object.keys(audioLibrary[type]).forEach(audio => audioLibrary[type][audio].volume = adjustedVolume(type));
}

if (!volume.music)
	setVolume(0.3, 'music');
else volume.music = parseFloat(volume.music, 10);
if (!volume.sfx)
	setVolume(0.5, 'sfx');
else volume.sfx = parseFloat(volume.sfx, 10);

export { play, stopMusic, stopCategory, getVolume, setVolume };