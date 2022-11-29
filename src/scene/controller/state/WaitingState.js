
export default class WaitingState {

	constructor (scene) {

		this.scene = scene;
		this.name = "waiting";
	}

	act (action, params) {

	}

	select (element) {

		switch (element.id.type) {
		case "card": {
			this.scene.setState({focus: element});
			break;
		}
		case "tile": {
			if (element.unit)
				this.scene.setState({focus: element.unit});
			else if (element.structure)
				this.scene.setState({focus: element.structure});
			else this.scene.setState({focus: element});
			break;
		}
		default: break;
		}
	}

	hover (element, enter) {

	}

	deselect () {

	  	this.scene.unfocus();
	}
}