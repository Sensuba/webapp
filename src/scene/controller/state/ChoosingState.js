
import SocketManager from '../../../SocketManager';

export default class ChoosingState {

	constructor (scene, game) {

		this.scene = scene;
		this.game = game;
		this.name = "choosing";
	}

	act (action, ...params) {

		switch (action) {
		case "choose": {
			SocketManager.master.command('choose', params[0]);
			break;
		}
		default: break;
		}
	}
}