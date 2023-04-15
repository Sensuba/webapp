import Wait from './view/animation/Wait';
import AddToHand from './view/animation/AddToHand';
import RemoveFromHand from './view/animation/RemoveFromHand';
import Summon from './view/animation/Summon';
import Silence from './view/animation/Silence';
import Attack from './view/animation/Attack';
import Damage from './view/animation/Damage';
import Heal from './view/animation/Heal';
import Destroy from './view/animation/Destroy';
import Banish from './view/animation/Banish';
import Listener from './view/animation/Listener';
import Target from './view/animation/Target';
import ShieldBreak from './view/animation/ShieldBreak';

export default class Sequencer {

	constructor (master, dispatch) {

		this.master = master;
		this.queue = [];
		this.current = null;
		this.dispatch = dispatch;
		this.logs = [];
		/*this.extraturns = [0, 0];
		this.currentturn = -1;*/
	}

	add (event) {

		if (this.current)
			this.queue.push(event);
		else
			this.read(event);
	}

	next () {

		this.current = null;
		if (this.queue.length > 0)
			this.read(this.queue.shift());
	}

	read (event) {

		if (this.master.stopped)
			return;
		let n = event.n;
		this.logs.push(n);
		if (event.callback)
			event.callback();
		var anim = this.notifToAnim(n);
		if (anim) {
			if (anim.sync)
				this.current = anim;
			if (!anim.before)
				this.dispatch(n);
			anim.start(() => {
				if (anim.before)
					this.dispatch(n);
				this.next();
			});
		} else {
			this.dispatch(n);
			this.next();
		}

		/*var anim = this.notifToAnim(n);
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
		}*/
	}

	update () {

		if (!this.current.sync)
			this.next();
	}

	notifToAnim (n) {

	  switch(n.type) {
	    case "gamestate": return new Wait(this.master, 1000);
	    case "animation": {
	    	switch (n.data[0]) {
	    	case "spark": return new Wait(this.master, 300);
	    	default: return null;
	    	}
	    }
	    case "cast": {
	    	return new Wait(this.master, 200);
	    }
	    case "summon": {
	    	return new Summon(this.master, n.data[0].no);
	    }
	    case "silence": {
	    	return new Silence(this.master, n.data[0].no);
	    }
	    case "attack.before": {
	    	return new Attack(this.master, n.data[0].no);
	    }
	    case "destroy.before": {
	    	return new Destroy(this.master, n.data[0].no);
	    }
	    case "banish.before": {
		    let card = this.master.state.model.find(n.data[0]);
		    if (card.onField)
	    		return new Banish(this.master, n.data[0].no);
	    	if (card.inHand)
	    		return new RemoveFromHand(this.master, n.data[0].no);
	    	break;
	    }
	    case "damage": {
	    	return new Damage(this.master, n.data[0], n.data[1]);
	    }
	    case "nodamage": {
	    	return new Damage(this.master, n.data[0], 0);
	    }
	    case "heal": {
	    	return new Heal(this.master, n.data[0], n.data[1]);
	    }
	    case "listener": {
	    	return new Listener(this.master, n.data[0]);
	    }
	    case "burst": {
	    	return new Wait(this.master, 100);
	    }
	    case "shieldbreak": {
	    	return new ShieldBreak(this.master, n.data[0]);
	    }
		case "cast.before": {
		    return n.data[2] && (n.data[2].type === "card" || n.data[2].type === "hero") ? new Target(this.master, n.data[2]) : new Wait(this.master, 1000);
		}
		/*case "playcard": {
			return null;
		}*/
		case "skilltrigger.before": {
			return n.data[2] && (n.data[2].type === "card" || n.data[2].type === "hero") ? new Target(this.master, n.data[2]) : new Wait(this.master, 1000);
		}
		case "playtarget.before": {
			return n.data[2] && (n.data[2].type === "card" || n.data[2].type === "hero") ? new Target(this.master, n.data[2]) : null;
		}
	    case "movecard.before": {
	    	/*if (n.data[1] && n.data[1].type === "hand") {
		    	let card = this.master.state.model.find(n.data[0]);
		    	if (card)
		    		return new RemoveFromHand(this.master, n.data[0].no);
		    }*/
		    break;
		}
	    case "movecard": {
	    	if (n.data[2] && n.data[2].type === "hand") {
		    	let card = this.master.state.model.find(n.data[0]);
		    	if (card)
		    		return new AddToHand(this.master, n.data[0].no);
		    }
		    /*if (n.data[1] && n.data[1].type === "hand") {
		    	let card = this.master.state.model.find(n.data[0]);
		    	if (card)
		    		return new RemoveFromHand(this.master, n.data[0].no);
		    }*/
		    /*if (n.data[2] && n.data[2].type === "court") {
		    	return new Wait(this.master, 1000);
		    }*/
	    	break; }
	    default: return null;
	    }
	}
}