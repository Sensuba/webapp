import Library from '../utility/Library.js';
import Reader from './blueprint/Reader.js';

export default class Card {

	constructor (game, model) {

		if(!arguments.length) return;

		this.game = game;
		this.game.register(this, "card");
		this.model = model;
		this.reset(true);

		this.game.notify("newcard", this, this.serialize());

		if (this.blueprints[0])
			Reader.read(this.blueprints[0], this);
	}

	get player () {

		if (!this.location)
			return undefined;
		return this.location.player;
	}

	get isHero () { return false }
	get isUnit () { return this.type === "unit" }
	get isBuilding () { return this.type === "building" }
	get isSpell () { return this.type === "spell" }
	get isCharacter () { return this.isUnit }

	get inHand () { return this.location && this.location.id.type === "hand" }
	get inDeck () { return this.location && this.location.id.type === "deck" }
	get onField () { return this.location && this.location.id.type === "tile" }
	get inCourt () { return this.location && this.location.id.type === "court" }
	get destroyed () { return this.location && this.location.id.type === "graveyard" }
	get banished () { return this.location && this.location.id.type === "nether" }

	get currentHp () { return this.eff.hp === undefined ? undefined : this.eff.hp - this.dmg }

	reset (soft=false) {

		this.passives = [];
		this.handPassives = [];
		this.blueprints = [];
		["mana", "type", "color", "categories", "atk", "hp", "blueprint", "states"].forEach(k => this[k] = this.model[k]);
		if (!this.categories)
			this.categories = [];
		this.categories = this.categories.slice();
		let states = {};
		if (this.states)
			this.states.forEach(s => states[s] = true);
		this.states = states;
		if (this.blueprint) {
			this.blueprints.push(this.blueprint);
			delete this.blueprint;
			if (!soft)
				Reader.read(this.blueprints[0], this);
		}
	}

	goto (location) {

		if (this.location === location)
			return;

		let former = this.location;
		this.game.notify("movecard.before", this, former, location);

		if (this.activated && this.onField && location.id.type !== "tile")
			this.deactivate();
		else if (this.handActivated && this.inHand)
			this.deactivateHand();
		this.location = location;
		if (former && former.hasCard(this))
			former.removeCard(this);
		if (location && !location.hasCard(this))
			location.addCard(this);
		if (!this.handActivated && this.inHand)
			this.activateHand();

		this.game.notify("movecard", this, former, location);
	}

	sendTo (location) {

		if (this.location === location || this.banished)
			return this;

		if (this.location && this.location.layer && location.layer && this.location.layer > location.layer) {

			this.banish();
			let newcopy = new Card(this.game, this.model);
			newcopy.goto(location);
			return newcopy;
		}

		this.goto(location);
		return this;
	}

	summon (tile) {

		if (tile.isFull && this.location !== tile) {
			this.banish();
			return;
		}
		this.game.notify("summon.before", this, tile);
		let card = this.sendTo(tile);
		delete card.actioned;
		card.summoningSickness = true;
		card.dmg = card.dmg || 0;
		card.activate();
		this.game.notify("summon", card, tile);

		if (card.hasState("burst"))
			card.burst();

		return card;
	}

	damage (dmg, src) {

		if (src.isSpell && this.eff.barrier)
			dmg -= this.eff.barrier;

		if (dmg <= 0)
			return { damage: 0, kill: false, overkill: 0 };

		if (this.hasState("shield")) {
			this.breakShield();
			return { damage: 0, kill: false, overkill: 0 };
		}

		this.game.notify("damage.before", this, dmg, src);
		this.dmg += dmg;
		let kill = this.ghost;
		let overkill = kill ? this.dmg - this.eff.hp : 0;
		this.game.notify("damage", this, dmg, src, kill, overkill);

		if (src && src.hasState("drain"))
			src.player.hero.heal(dmg, src);

		if (this.ghost)
			this.destroy();
		
		return { damage: dmg, kill, overkill };
	}

	heal (heal, src) {

		if (heal <= 0)
			return;
		this.game.notify("heal.before", this, heal, src, 0);
		let actualheal = Math.min(this.dmg, heal);
		let overheal = heal - actualheal;
		this.dmg -= actualheal;
		this.game.notify("heal", this, actualheal, src, overheal);
	}

	get ghost () {

		return this.onField && ((this.dmg || 0) >= this.eff.hp || this.sentenced);
	}

	destroy () {

		if (this.game.broadcaster.locked) {
			this.sentenced = true;
			return;
		}

		this.game.notify("destroy.before", this);

		let tile = this.location;
		this.goto(this.player.graveyard);

		this.game.notify("destroy", this);

		if (this.hasState("undying") && !tile.isFull) {
			let card = this.sendTo(tile);
			card.setDamage(card.hp - 1);
			card.setState("undying", false);
			card.summon(tile);
		}
	}

	get inFront () {

		return this.onField && this.location.units[0] === this;
	}

	get inBack () {

		return this.onField && this.location.units[0] !== this;
	}

	findAttackTarget () {

		let target = null;
		this.location.opposite.units.forEach(c => {
			if (target)
				return;
			target = c;
		})
		return target || this.player.opponent.hero;
	}

	get canAttack () {

		if (!this.onField || this.isBuilding)
			return false;
		if (this.hasState("warden") || this.hasState('freeze'))
			return false;
		if (this.actioned)
			return false;
		if (this.summoningSickness && !(this.hasState('agility') && this.findAttackTarget().isUnit))
			return false;
		//if (this.inBack && !this.hasState("reach"))
		//	return false;
		return true;
	}

	attack () {

		if (!this.onField || this.isBuilding)
			return;

		let target = this.findAttackTarget();

		this.game.notify("attack", this, target);

		if (target === this || (target.isUnit && !target.onField))
			return;

		let lock = !this.game.broadcaster.locked;
		if (lock)
			this.game.broadcaster.lock();

		let atk = Math.max(0, this.eff.atk - (target.eff.armor || 0));
		if (!this.hasState("initiative"))
			target.ripost(this);
		target.damage(atk, this);

		if (lock)
			this.game.broadcaster.unlock();
	}

	tryToAttack () {

		if (!this.canAttack)
			return false;
		this.attack();
		return true;
	}

	canMove (right) {

		if (!this.onField || this.isBuilding)
			return false;
		if (this.hasState("warden") || this.hasState('freeze') || this.hasState('trap'))
			return false;
		if (this.summoningSickness || this.actioned)
			return false;
		if (!right && this.location.x <= 0)
			return false;
		if (right && this.location.x >= 4)
			return false;
		let /*former = this.location,*/ newtile = this.player.tiles[this.location.x + (right ? 1 : -1)];
		if (newtile.isFull)
			return false;
		return true;
	}

	move (right) {

		if (!this.onField || this.isBuilding)
			return;

		if (!right && this.location.x <= 0)
			return;
		if (right && this.location.x >= 4)
			return;
		let former = this.location, newtile = this.player.tiles[this.location.x + (right ? 1 : -1)];
		if (newtile.isFull)
			return;

		this.game.notify("move.before", this, former, newtile, right);
		this.goto(newtile);
		this.game.notify("move", this, former, newtile, right);
	}

	tryToMove (right) {

		if (!this.canMove(right))
			return false;
		this.move(right);
		return true;
	}

	ripost (other) {

		if (this.isBuilding)
			return;
		if (this.eff.atk > 0)
			other.damage(Math.max(this.eff.atk - (other.eff.armor || 0)), this);
	}

	burst () {

		if (!this.onField)
			return;
		this.attack();
	}

	breakShield () {

		this.game.notify("shieldbreak.before", this);
		delete this.states.shield;
		this.game.notify("shieldbreak", this);
	}

	discard () {

		if (!this.location || this.location.id.type === "discard")
			return;
		this.game.notify("discard.before", this, this.player);
		this.goto(this.player.discard);
		this.game.notify("discard", this, this.player);
	}

	banish () {

		if (this.location && this.location.id.type === "nether")
			return;
		this.game.notify("banish.before", this);
		this.goto(this.player.nether);
		this.blueprints = [];
		this.game.notify("banish", this);
	}

	hasCategory (category) {

		return this.categories && this.categories.includes(category);
	}

	hasState (state) {

		switch (state) {
		case "armor": {
			return this.eff.armor && this.eff.armor > 0;
			break;
		}
		case "barrier": {
			return this.eff.barrier && this.eff.barrier > 0;
			break;
		}
		default: break;
		}

		return this.eff.states && this.eff.states[state] === true;
	}

	setState (state, value) {

		this.states = this.states || {};
		this.game.notify("setstate.before", this, state, value);
		this.states[state] = value;
		this.game.notify("setstate", this, state, value);
	}

	setDamage (value) {

		this.game.notify("setdamage.before", this, value);
		this.dmg = value;
		this.game.notify("setdamage", this, value);
	}

	get hasTarget () {

		return this.targetType;
	}

	canTarget (player, target) {

		if (!this.targetFunction)
			return false;
		if (!target)
			return false;
		if (this.targetType !== target.type)
			return false;
		if (this.targetType === "card" && target.data.hasState("exalted"))
			return false;
		if (target.data === this)
			return false;

		return this.targetFunction(target.data);
	}

	autocast (player) {

		if (!this.isSpell)
			return;
		player = player || this.player;
		if (!this.hasTarget) {
			this.game.stack.cast(player, this);
		} else if (player.hasValidTargets(this)) {
			let targets;
			if (this.targetType === "column")
				targets = this.game.field.columns.filter(col => this.canTarget(player, {type: "column", data: col}))
			else if (this.targetType === "card")
				targets = this.game.field.all.some(tile => tile.cards.some(c => this.canTarget(player, {type: "card", data: c}))) || this.canTarget(player, {type: "card", data: player.hero}) || this.canTarget(player, {type: "card", data: player.opponent.hero});
			if (targets)
				this.game.stack.cast(player, this, targets[Math.floor(Math.random() * targets.length)]);
		}
	}

	cast (player, target) {

		if (!this.isSpell)
			return;
		if (!this.hasTarget)
			target = undefined;
		player = player || this.player;
		this.game.stack.cast(player, this, target);
	}

	setStats (mana, atk, hp) {

		if ((mana === null || mana === undefined) && (atk === null || atk === undefined) && (hp === null || hp === undefined))
			return;

		this.game.notify("setstats.before", this, mana, atk, hp);
		if (mana || mana === 0)
			this.mana = mana;
		if (atk || atk === 0)
			this.atk = atk;
		if (hp || hp === 0) {
			this.hp = hp;
			if (this.dmg)
				this.dmg = 0;
		}

		if (this.ghost)
			this.destroy();

		this.game.notify("setstats", this, mana, atk, hp);
	}

	addStats (atk, hp) {

		if ((!atk || (atk < 0 && this.atk <= 0)) && (!hp || (hp < 0 && this.hp <= 0)))
			return;

		if (this.atk + atk < 0)
			atk = -this.atk;
		if (this.hp + hp < 0)
			hp = -this.hp;

		this.game.notify("addstats.before", this, atk, hp);
		if (atk)
			this.atk += atk;
		if (hp)
			this.hp += hp;

		if (this.ghost)
			this.destroy();

		this.game.notify("addstats", this, atk, hp);
	}

	changeCost (value) {

		if (!value || (value < 0 && this.mana <= 0))
			return;

		if (this.mana + value < 0)
			value = -this.mana;
		this.game.notify("changecost.before", this, value);
		this.mana = this.mana + value;
		this.game.notify("changecost", this, value);
	}

	overload (value, type) {

		if (!value || value < 0)
			return;

		this.game.notify("overload.before", this, value, type);
		this.booster = this.booster || {};
		this.booster[type] = (this.booster[type] || 0) + value;
		this.game.notify("overload", this, value, type);
	}

	silence () {

		this.game.notify("silence.before", this);
		this.states = {};
		this.states.silence = true;
		this.passives.forEach(passive => passive.deactivate());
		this.passives = [];
		this.blueprints = [];
		this.atk = this.model.atk;
		let chp = this.currentHp;
		this.hp = this.model.hp;
		this.dmg = Math.max(0, this.hp - chp);

		if (this.ghost)
			this.destroy();

		this.game.notify("silence", this);
	}

	setVariable (name, value) {

		this.variables = this.variables || {};
		this.variables[name] = value;
		this.game.notify("storevar", this, name, value);
	}

	getVariable (name) {

		return this.variables ? this.variables[name] : undefined;
	}

	clearVariable (name) {

		if (this.variables) {
			delete this.variables[name];
			this.game.notify("clearvar", this, name);
		}
	}

	addEffect (blueprint) {

		this.blueprints.push(blueprint);
		Reader.read(blueprint, this);
		this.game.notify("addeffect", this, blueprint);
	}

	refresh () {

		delete this.actioned;
		delete this.summoningSickness;

		if (this.hasState("ephemeral"))
			this.destroy();
		else if (this.hasState("freeze"))
			this.freezetimer = true;
	}

	activate () {

		if (this.activated)
			return;
		this.activated = true;
		this.passives.forEach(passive => passive.activate());
	}

	deactivate () {

		if (!this.activated)
			return;
		this.activated = false;
		this.passives.forEach(passive => passive.deactivate());
	}

	activateHand () {

		if (this.handActivated)
			return;
		this.handActivated = true;
		this.handPassives.forEach(passive => passive.activate());
	}

	deactivateHand () {

		if (!this.handActivated)
			return;
		this.handActivated = false;
		this.handPassives.forEach(passive => passive.deactivate());
	}

	copy (reset=false) {

		let copy = new Card(this.game, this.model);

		if (reset)
			return copy;

		let serial = this.serialize();
		delete serial.model;
		delete serial.index;
		Object.keys(serial).forEach(key => copy[key] = serial[key]);
		return copy;
	}

	transform (model) {

		let transform = new Card(this.game, model);

		this.game.notify("transform.before", this, transform);
		transform.location = this.location;
		let index = this.location.cards.indexOf(this);
		this.location.cards[index] = transform;
		this.location = this.player.nether;
		if (this.activated && transform.onField) {
			this.deactivate();
			transform.activate();
		}
		else if (this.handActivated && transform.inHand) {
			this.deactivateHand();
			transform.activateHand();
		}
		this.blueprints = [];
		this.game.notify("transform", this, transform);

		return transform;
	}

	get eff () {

		if (!this.onField && !this.inHand && !this.inCourt)
			return this;
		return this.effective || this;
	}

	update () {

		if (!this.onField && !this.inHand && !this.inCourt) {

			delete this.effective;
			return;
		}

		// Copy base data
		this.effective = this.serialize();
		this.effective.model = this.model;

		// Apply auras
		this.game.auras.forEach(aura => {
			if (aura.applicable(this))
				this.effective = aura.apply(this.effective);
		});

		// Apply mutations
		if (this.mutations)
			this.effective = this.mutations.sort((a, b) => a.priority - b.priority).reduce((card, mut) => mut.apply(card), this.effective);

		// Remove damage when removing HP mutations
		if (this.onField) {
			let bonushp = Math.max(0, this.effective.hp - this.hp);
			let diffhp = this.bonushp && this.bonushp > bonushp ? this.bonushp - bonushp : 0;
			if (diffhp)
				this.dmg -= Math.min(diffhp, this.dmg);
			this.bonushp = bonushp ? bonushp : undefined;
		}

		// Remove permanent data from state changes
		if (this.states.freeze && !this.hasState("freeze")) {
			delete this.states.freeze;
			delete this.freezetimer;
		}
	}

	serialize () {

		let variables = this.variables ? Object.assign({}, this.variables) : undefined;
		if (variables)
			Object.keys(variables).forEach(key => {
				if (typeof variables[key] === 'object')
					variables[key] = variables[key].id;
			})

		return {
			model: this.model.key,
			mana: this.mana,
			atk: this.atk,
			states: Object.assign({}, this.states),
			color: this.color,
			categories: this.categories.slice(),
			hp: this.hp,
			bonushp: this.bonushp,
			booster: this.booster,
			dmg: this.dmg,
			armor: this.armor,
			barrier: this.barrier,
			variables: variables,
			freezetimer: this.freezetimer,
			extratriggers: this.extratriggers,
			type: this.type,
			actioned: this.actioned,
			summoningSickness: this.summoningSickness,
			index: this.index,
			blueprints: this.blueprints
		}
	}

	setup (game, data) {
		
		this.game = game;
		this.mana = data.mana;
		this.atk = data.atk;
		this.hp = data.hp;
		this.bonushp = data.bonushp;
		this.booster = data.booster;
		this.states = data.states;
		this.color = data.color;
		this.categories = data.categories;
		this.dmg = data.dmg;
		this.armor = data.armor;
		this.barrier = data.barrier;
		this.freezetimer = data.freezetimer;
		this.extratriggers = data.extratriggers;
		this.type = data.type;
		this.variables = data.variables;
		if (this.variables)
			Object.keys(this.variables).forEach(key => {
				if (typeof this.variables[key] === 'object')
					this.variables[key] = game.find(this.variables[key]);
			})
		this.actioned = data.actioned;
		this.summoningSickness = data.summoningSickness;
		this.index = data.index;
		this.passives = [];
		this.handPassives = [];
		this.model = Library.getCard(data.model);
		this.blueprints = data.blueprints;
		this.blueprints.forEach(bp => Reader.read(bp, this));
		if (this.onField)
			this.activate();
		if (this.inHand)
			this.activateHand();
	}
}