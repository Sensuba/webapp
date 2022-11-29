import en from './translations/en/app.json';
import fr from './translations/fr/app.json';

//const languages = ["en", "fr"];
const DEFAULT_LANGUAGE = "en";

let text = {};
let selected = localStorage.getItem('language');

text.en = en;
text.fr = fr;

let setLanguage = language => {

	localStorage.setItem('language', language)
	if (selected !== language)
		Object.keys(localStorage).forEach(key => { if (key.startsWith('library.') && !key.endsWith('.version')) localStorage.removeItem(key); });
	selected = language;
}

let getLanguage = () => {

	return selected;
}

let read = id => {

	let current = text[selected];
	id.split("/").forEach(e => current = current[e]);
	return current;
}


if (!selected)
	setLanguage(DEFAULT_LANGUAGE);

export { read, getLanguage, setLanguage };