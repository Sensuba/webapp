
import PlayingState from './PlayingState';
import SocketManager from '../../../SocketManager';

export default class MovingState {

	constructor (scene, game, unit) {

		this.scene = scene;
		this.game = game;
		this.unit = unit;
		this.name = "moving";
		this.motion = [];
	}

	act (action, ...params) {

		switch (action) {
		case "cancel": this.scene.cancelTarget(); break;
		default: break;
		}
	}

	select (element) {

		switch (element.id.type) {
		case "card": {
			this.scene.controller = new PlayingState(this.scene, this.game);
			this.scene.setState({focus: element, subfocus: null, rotation: this.scene.reverse ? 3 : 0});
			break;
		}
		case "tile": {
			if (this.target && element === this.target)
				SocketManager.master.command('move', this.unit.id, this.motion.map(m => m.r));
			this.scene.controller = new PlayingState(this.scene, this.game);
			if (element.unit)
				this.scene.setState({focus: element.unit, motion: null});
			else if (element.structure)
				this.scene.setState({focus: element.structure});
			else this.scene.setState({focus: element});
			break;
		}
		default: break;
		}
	}

	hover (element, enter) {

		switch (element.id.type) {
		case "tile": {

			if (!enter)
				break;

			if (element === this.unit.tile) {
				if (this.motion) {
					this.motion = [];
					delete this.target;
					this.scene.setState({motion: null});
				}
				break;
			}

			let distance = this.unit.tile.distanceTo(element);
			let previous = this.target ? this.target : this.unit.tile;

			if (distance > this.unit.motion) {
				if (this.motion) {
					this.motion = [];
					delete this.target;
					this.scene.setState({motion: null});
				}
				break;
			}

			if (element.isAdjacentTo(previous)) {

				let direction = 0, to = previous.to(element);
				if (to[0] === 1 && to[1] === 1) direction = 1;
				else if (to[0] === 1 && to[1] === 0) direction = 2;
				else if (to[0] === 0 && to[1] === -1) direction = 3;
				else if (to[0] === -1 && to[1] === -1) direction = 4;
				else if (to[0] === -1 && to[1] === 0) direction = 5;

				if (this.motion.length > 0 && (direction+3)%6 === this.motion[this.motion.length-1].r) {
					this.motion.pop();
					this.target = element;
					this.scene.setState({motion: this.motion});
					break;
				}

				if (this.motion.length < this.unit.motion) {
					this.motion.push({tile: previous, r: direction});
					this.target = element;
					this.scene.setState({motion: this.motion});
					break;
				}
			} 

			let path = this.unit.tile.findPathTo(element, this.unit.motion);
			if (!path || path.length > this.unit.motion) {
				if (this.motion) {
					this.motion = [];
					delete this.target;
					this.scene.setState({motion: null});
				}
				break;
			}

			this.motion = [];
			path.forEach((p, i) => this.motion.push({tile: i === 0 ? this.unit.tile : this.motion[i-1].tile.translate(this.motion[i-1].r), r:p}));
			this.target = element;
			this.scene.setState({motion: this.motion});
			break;
		}
		default: break;
		}
	}

	deselect () {

	  	this.scene.controller = new PlayingState(this.scene, this.game);
	  	this.scene.unfocus();
	}
}