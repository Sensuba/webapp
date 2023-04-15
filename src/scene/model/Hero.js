import Library from '../utility/Library.js';
import Reader from './blueprint/Reader.js';

const HERO_STARTING_HP = 60;
const HERO_LV2_MANA = 1;
const HERO_LVMAX_MANA = 5;

export default class Hero {

	activated = true;

	constructor (player, id) {

		if(!arguments.length) return;

		this.location = player.throne;
		this.location.cards.push(this);
		this.game = player.game;
		this.game.register(this, "hero");
		this.model = Library.getHero(id);
		this.reset();
	}

	get isHero () { return true }
	get isUnit () { return false }
	get isBuilding () { return false }
	get isSpell () { return false }
	get isCharacter () { return true }

	get currentHp () { return this.hp === undefined ? undefined : this.hp - this.dmg }

	get player () { return this.location.player }

	get levelUpMana () {

		switch (this.level) {
		case 1: return HERO_LV2_MANA;
		case 2: return HERO_LVMAX_MANA;
		default: return null;
		}
	}

	reset () {

		this.hp = HERO_STARTING_HP;
		this.dmg = 0;
		this.level = 1;
		this.passives = [];
		this.blueprints = [];
		["colors"].forEach(k => this[k] = this.model[k]);
		this.skills = [[], []];
		this.states = {};
		this.activated = false;
		this.model.abilities.forEach(ability => {
			if (ability.blueprint)
				Reader.read(ability.blueprint, this);
		})
		this.activated = true;
	}

	get ghost () {

		return ((this.dmg || 0) >= this.eff.hp || this.sentenced);
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
		if (this.dmgModifier !== undefined) {
			dmg = this.dmgModifier;
			delete this.dmgModifier;
		}
		if (dmg <= 0) {
			this.game.notify("nodamage", this, src);
			return { damage: 0, kill: false, overkill: 0 };
		}
		this.dmg += dmg;
		let kill = this.ghost;
		let overkill = kill ? this.dmg - this.eff.hp : 0;
		this.game.notify("damage", this, dmg, src, kill, overkill);

		if (src && src.hasState("drain"))
			src.player.hero.heal(dmg, src);

		if (this.dmg >= this.hp)
			this.destroy();
		
		return { damage: dmg, kill, overkill };
	}

	ripost (other) {
		
	}

	addEffect (blueprint) {

		this.blueprints.push(blueprint);
		Reader.read(blueprint, this);
		this.game.notify("addeffect", this, blueprint);
	}

	hasState (state) {

		switch (state) {
		case "armor": {
			return this.eff.armor && this.eff.armor > 0;
		}
		case "barrier": {
			return this.eff.barrier && this.eff.barrier > 0;
		}
		default: break;
		}

		return this.eff.states && this.eff.states[state];
	}

	setState (state, value) {

		this.states = this.states || {};
		this.game.notify("setstate.before", this, state, value);
		this.states[state] = value;
		this.game.notify("setstate", this, state, value);
	}

	hasCategory (category) {

		return false;
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

	levelUp () {

		if (this.level === 3)
			return;
		let level = this.level + 1;
		this.game.notify("levelup.before", this, level);
		this.level = level;
		if (this.level === 3)
			this.passives.forEach(passive => passive.activate());
		this.game.notify("levelup", this, level);
	}

	useSkill (no, target) {

		if (no !== 0 && no !== 1)
			return;
		if (this.level < 2)
			return;
		if (this.skills[this.level-2].length-1 < no)
			return;
		this.game.notify("skill.before", this, no);
		this.skills[this.level-2][no].event(target ? target.data : undefined);
		this.game.notify("skill", this, no);
	}

	refreshSkill () {

		if (!this.skillUsed)
			return;
		this.game.notify("refreshskill.before", this);
		delete this.skillUsed;
		this.game.notify("refreshskill", this);
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

	destroy () {
		
		if (this.game.broadcaster.locked) {
			this.sentenced = true;
			return;
		}

		this.game.notify("herodestroy", this);
	}

	refresh () {

		delete this.skillUsed;
	}

	get eff () {

		return this.effective || this;
	}

	update () {

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
		let bonushp = Math.max(0, this.effective.hp - this.hp);
		let diffhp = this.bonushp && this.bonushp > bonushp ? this.bonushp - bonushp : 0;
		if (diffhp)
			this.dmg -= Math.min(diffhp, this.dmg);
		this.bonushp = bonushp ? bonushp : undefined;
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
			dmg: this.dmg,
			states: Object.assign({}, this.states),
			colors: this.colors,
			hp: this.hp,
			level: this.level,
			variables: variables,
			skillUsed: this.skillUsed,
			blueprints: this.blueprints
		}
	}

	setup (game, data) {
		
		this.game = game;
		this.colors = data.colors;
		this.hp = data.hp;
		this.dmg = data.dmg;
		this.states = data.states;
		this.level = data.level;
		this.skillUsed = data.skillUsed;
		this.variables = data.variables;
		if (this.variables)
			Object.keys(this.variables).forEach(key => {
				if (typeof this.variables[key] === 'object')
					this.variables[key] = game.find(this.variables[key]);
			})
		this.model = Library.getHero(data.model);
		this.passives = [];
		this.skills = [[], []];
		this.activated = false;
		this.model.abilities.forEach(ability => {
			if (ability.blueprint)
				Reader.read(ability.blueprint, this);
		});
		this.activated = true;
		this.blueprints = data.blueprints;
		this.blueprints.forEach(bp => Reader.read(bp, this.hero));
	}
}