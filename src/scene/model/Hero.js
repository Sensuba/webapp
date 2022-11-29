import Library from '../utility/Library.js';
import Reader from './blueprint/Reader.js';

const HERO_STARTING_HP = 60;
const HERO_LV2_MANA = 1;
const HERO_LVMAX_MANA = 5;

export default class Hero {

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
		["colors"].forEach(k => this[k] = this.model[k]);
		this.skills = [[], []];
		this.model.abilities.forEach(ability => {
			if (ability.blueprint)
				Reader.read(ability.blueprint, this);
		})
	}

	damage (dmg, src) {

		if (dmg <= 0)
			return { damage: 0, kill: false, overkill: 0 };
		
		this.game.notify("damage.before", this, dmg, src);
		this.dmg += dmg;
		let kill = this.ghost;
		let overkill = kill ? this.dmg - this.eff.hp : 0;
		this.game.notify("damage", this, dmg, src, kill, overkill);

		if (src && src.hasState("drain"))
			src.player.hero.heal(dmg, src);

		if (this.onField && this.dmg >= this.hp && !this.dead) {
			this.dead = true;
			this.game.notify("herodead", this);
		}
		
		return { damage: dmg, kill, overkill };
	}

	ripost (other) {
		
	}

	setState (state) {
		
	}

	hasState (state) {

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

	refresh () {

		delete this.skillUsed;
	}

	get eff () {

		return this;
	}

	update () {

	}

	serialize () {

		return {
			model: this.model.key,
			dmg: this.dmg,
			colors: this.colors,
			hp: this.hp,
			level: this.level,
			variables: this.variables ? this.variables.map(v => typeof v === 'object' ? v.id : v) : undefined,
			skillUsed: this.skillUsed
		}
	}

	setup (game, data) {
		
		this.game = game;
		this.colors = data.colors;
		this.hp = data.hp;
		this.dmg = data.dmg;
		this.level = data.level;
		this.skillUsed = data.skillUsed;
		this.variables = data.variables ? data.variables.map(v => typeof v === 'object' ? game.find(v) : v) : undefined;
		this.model = Library.getHero(data.model);
		this.passives = [];
		this.skills = [[], []];
		this.model.abilities.forEach(ability => {
			if (ability.blueprint)
				Reader.read(ability.blueprint, this);
		});
	}
}