import Library from '../utility/Library.js';
import Reader from './blueprint/Reader.js';

export default class Card {

	constructor (game, model) {

		if(!arguments.length) return;

		this.game = game;
		this.game.register(this, "card");
		this.model = model;
		this.reset();

		this.game.notify("newcard", this, this.serialize());
	}

	get player () {

		if (!this.location)
			return undefined;
		return this.location.player;
	}

	get isHero () { return false }
	get isUnit () { return this.type === "unit" }
	get isSpell () { return this.type === "spell" }
	get isCharacter () { return this.isUnit }

	get inHand () { return this.location && this.location.id.type === "hand" }
	get inDeck () { return this.location && this.location.id.type === "deck" }
	get onField () { return this.location && this.location.id.type === "tile" }
	get inCourt () { return this.location && this.location.id.type === "court" }

	get currentHp () { return this.eff.hp === undefined ? undefined : this.eff.hp - this.dmg }

	reset () {

		this.passives = [];
		this.blueprints = [];
		["mana", "type", "color", "categories", "atk", "hp", "blueprint", "states"].forEach(k => this[k] = this.model[k]);
		this.categories = this.categories.slice();
		let states = {};
		if (this.states)
			this.states.forEach(s => states[s] = true);
		this.states = states;
		if (this.blueprint) {
			this.blueprints.push(this.blueprint);
			delete this.blueprint;
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
		this.location = location;
		if (former && former.hasCard(this))
			former.removeCard(this);
		if (location && !location.hasCard(this))
			location.addCard(this);

		this.game.notify("movecard", this, former, location);
	}

	sendTo (location) {

		if (this.location === location)
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

		if (tile.isFull) {
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
	}

	damage (dmg, src) {

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

		if (this.ghost && !this.game.broadcaster.locked)
			this.destroy();
		
		return { damage: dmg, kill, overkill };
	}

	heal (heal, src) {

		if (heal <= 0)
			return;
		this.game.notify("heal.before", this, heal, src);
		if (!this.dmg)
			return;
		heal = Math.min(this.dmg, heal);
		this.dmg -= heal;
		this.game.notify("heal", this, heal, src);
	}

	get ghost () {

		return this.onField && this.dmg >= this.eff.hp;
	}

	destroy () {

		this.game.notify("destroy.before", this);

		let tile = this.location;
		this.goto(this.player.graveyard);
		if (this.hasState("undying") && !tile.isFull) {
			let card = this.sendTo(tile);
			card.setDamage(card.hp - 1);
			card.setState("undying", false);
			card.summon(tile);
		}
		
		this.game.notify("destroy", this);
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

		if (!this.onField)
			return false;
		if (this.hasState("warden") || this.hasState('freeze'))
			return false;
		if (this.summoningSickness || this.actioned)
			return false;
		if (this.inBack && !this.hasState("reach"))
			return false;
		return true;
	}

	attack () {

		if (!this.onField)
			return;

		let target = this.findAttackTarget();

		this.game.notify("attack", this, target);
		let atk = Math.max(0, this.eff.atk - (target.eff.armor || 0));
		if (!this.hasState("initiative"))
			target.ripost(this);
		target.damage(atk, this);
	}

	tryToAttack () {

		if (!this.canAttack)
			return false;
		this.attack();
		return true;
	}

	canMove (right) {

		if (!this.onField)
			return false;
		if (this.hasState("warden") || this.hasState('freeze'))
			return false;
		if (this.summoningSickness || this.actioned)
			return false;
		if (!right && this.location.x <= 0)
			return false;
		if (right && this.location.x >= 4)
			return false;
		//let former = this.location, newtile = this.player.tiles[this.location.x + (right ? 1 : -1)];
		if (newtile.isFull)
			return false;
		return true;
	}

	move (right) {

		if (!this.onField)
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

		if (this.eff.atk > 0)
			other.damage(Math.max(this.eff.atk - (other.eff.armor || 0)), this);
	}

	burst () {

		if (!this.onField)
			return;
		if (this.inBack)
			this.location.switch();
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

		if (!this.location || this.location.id.type === "nether")
			return;
		this.game.notify("banish.before", this);
		this.goto(this.game.nether);
		this.blueprints = [];
		this.game.notify("banish", this);
	}

	hasCategory (category) {

		return this.categories && this.categories.includes(category);
	}

	hasState (state) {

		return this.eff.states && this.eff.states[state];
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

	overload (value) {

		if (!value || value < 0)
			return;

		this.game.notify("overload.before", this, value);
		this.boost = (this.boost || 0) + value;
		this.game.notify("overload", this, value);
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
			let diffhp = this.bonushp ? this.bonushp - bonushp : 0;
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

		return {
			model: this.model.key,
			mana: this.mana,
			atk: this.atk,
			states: Object.assign({}, this.states),
			color: this.color,
			categories: this.categories.slice(),
			hp: this.hp,
			bonushp: this.bonushp,
			boost: this.boost,
			dmg: this.dmg,
			armor: this.armor,
			variables: this.variables ? this.variables.map(v => typeof v === 'object' ? v.id : v) : undefined,
			freezetimer: this.freezetimer,
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
		this.boost = data.boost;
		this.states = data.states;
		this.color = data.color;
		this.categories = data.categories;
		this.dmg = data.dmg;
		this.armor = data.armor;
		this.freezetimer = data.freezetimer;
		this.type = data.type;
		this.variables = data.variables ? data.variables.map(v => typeof v === 'object' ? game.find(v) : v) : undefined;
		this.actioned = data.actioned;
		this.summoningSickness = data.summoningSickness;
		this.index = data.index;
		this.passives = [];
		this.model = Library.getCard(data.model);
		this.blueprints = data.blueprints;
		this.blueprints.forEach(bp => Reader.read(bp, this));
		if (this.onField)
			this.activate();
	}
}