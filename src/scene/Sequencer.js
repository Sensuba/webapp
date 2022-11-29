import Wait from './view/animation/Wait';
import AddToHand from './view/animation/AddToHand';
import RemoveFromHand from './view/animation/RemoveFromHand';

export default class Sequencer {

	constructor (master, dispatch) {

		this.master = master;
		this.queue = [];
		this.current = null;
		this.dispatch = dispatch;
		this.extraturns = [0, 0];
		this.currentturn = -1;
	}

	add (n) {

		if (this.current)
			this.queue.push(n);
		else
			this.read(n);
	}

	next () {

		this.current = null;
		if (this.queue.length > 0)
			this.read(this.queue.shift());
	}

	read (n) {

		var anim = this.notifToAnim(n);
		if (anim) {
			if (anim.sync)
				this.current = anim;
			if (anim.before) {
				anim.start(() => {
					this.dispatch(n);
					this.next();
				});
			}
			else {
				this.dispatch(n);
				this.resume = () => {
					delete this.resume;
					anim.start(() => {
						this.next();
					});
				};
			}
		} else {
			this.dispatch(n);
			this.next();
		}
	}

	update () {

		if (!this.current.sync)
			this.next();
	}

	notifToAnim (n) {

	  switch(n.type) {
	    case "gamestate": return new Wait(this.master, 1000);
	    case "movecard": {
	    	if (n.data[2] && n.data[2].type === "hand") {
		    	let card = this.master.state.model.find(n.data[0]);
		    	if (card)
		    		return new AddToHand(this.master, n.data[0].no);
		    }
		    if (n.data[1] && n.data[1].type === "hand") {
		    	let card = this.master.state.model.find(n.data[0]);
		    	if (card)
		    		return new RemoveFromHand(this.master, n.data[0].no);
		    }
	    	break; }
	    default: return null;
	    }
	}
}