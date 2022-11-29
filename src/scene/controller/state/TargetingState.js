
import PlayingState from './PlayingState';
import SocketManager from '../../../SocketManager';

export default class TargettingState {

	constructor (scene, game, card) {

		this.scene = scene;
		this.game = game;
		this.card = card;
		this.name = "targeting";
	}

	act (action, ...params) {

		switch (action) {
		case "target": {
			if (params[0]) {
				SocketManager.master.command('target', params[0]);
				//this.scene.setState({subfocus: null});
			}
			break;
		}
		default: break;
		}
	}
}