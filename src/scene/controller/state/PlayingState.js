
import SocketManager from '../../../SocketManager';

export default class PlayingState {

	constructor (scene, game) {

		this.scene = scene;
		this.game = game;
		this.name = "playing";
	}

	act (action, ...params) {

		switch (action) {
		case "endturn": SocketManager.master.command('endturn'); break;
		case "play": {
			if ((params[0].isUnit || params[0].hasTarget) && params.length > 1)
				SocketManager.master.command('play', params[0].id, params[1]);
			else
				SocketManager.master.command('play', params[0].id);
			break;
		}
		case "levelup": SocketManager.master.command('levelup'); break;
		case "skill": SocketManager.master.command('skill', params[0], params[1]); break;
		case "attack": {
			if (params[0].isUnit && params[0].canAttack)
				SocketManager.master.command('attack', params[0].id);
			break;
		}
		case "move": {
			if (params[0].isUnit && params[0].canMove(params[1]))
				SocketManager.master.command('move', params[0].id, params[1]);
			break;
		}
		case "switch": {
			if (this.game.players[this.scene.noPlayer].tiles[params[0]].canSwitch())
				SocketManager.master.command('switch', params[0]);
			break;
		}
		default: break;
		}
	}
}