import Event from "./Event";
import Hand from './Hand';
import Tile from './Tile';
import Deck from './Deck';
import Court from './Court';
import Cemetery from './Cemetery';
import Discard from './Discard';
import Mutation from './Mutation';
import Reader from '../blueprint/Reader';
import Library from '../../../services/Library';

export default class Card {

	constructor (noId, location) {

		this.id = { type: "card", no: noId };
		this.equals = other => this && other && other.id && this.id.type === other.id.type && this.id.no === other.id.no;
		location.area.gameboard.register(this);

		this.location = null;
		if (location) {
			//location.area.gameboard.notify("newcard", this.id, location.id);
			this.goto(location);
		}
	}

	get data() {

		var copy = Object.assign({}, this);
		delete copy.location;
		return copy;
	}

	get inHand() {

		return this.location instanceof Hand;
	}

	get inDeck() {

		return this.location instanceof Deck;
	}

	get onBoard() {

		return this.location instanceof Tile;
	}

	get destroyed() {

		return this.location === null || this.location instanceof Cemetery || this.location instanceof Discard;
	}

	get isGhost() {

		return this.onBoard && this.chp <= 0;
	}

	get damaged() {

		return this.hp && this.chp && this.chp < this.eff.hp;
	}

	summon (tile) {

		if (this.dying)
			this.resetBody();
		this.skillPt = 1;
		this.chp = this.eff.hp;
		this.php = { hp: this.hp, chp: this.chp }
		this.goto(tile);
		if (this.isType("character"))
			this.resetSickness();
		this.activate();
		this.gameboard.update();
	}

	goto (loc) {

		if (this.location === loc)
			return;
		var former = this.location;

		if (this.onBoard && loc instanceof Tile && loc.occupied) {
			let swapcard = loc.card;
			loc.card = null;
			this.goto(loc);
			swapcard.goto(former);
			return;
		}

		if (loc instanceof Court && this.overload)
			this.lb = this.eff.overload && this.eff.ol && this.eff.ol > this.eff.overload ? Math.floor(this.eff.ol/this.eff.overload) : 0;

		if (this.area && loc === this.area.opposite.choosebox) {
			this.invisible = { for: this.area.id.no };
		} else if (this.area && this.invisible && (loc.public || (loc.area === this.area && loc !== this.area.deck)))
			delete this.invisible;

		this.location = loc;
		if (former instanceof Tile && !(loc instanceof Tile) && this.activated)
			this.deactivate();
		if (former && former.hasCard (this))
			former.removeCard (this);
		if (former && (loc === null || former.locationOrder > loc.locationOrder || former.locationOrder === 0))
			this.resetBody ();
		if (loc && !loc.hasCard (this))
			loc.addCard (this);
		if (loc instanceof Tile && !(former instanceof Tile) && !this.activated)
			this.activate();
		if (former instanceof Tile && loc instanceof Tile && this.activated && former.area !== loc.area) {
			this.deactivate();
			this.activate();
		}
		//if (this.onBoard)
		//	this.location.clearHazards();
		if (this.onBoard && former && former.area === this.area.opposite) {
			this.skillPt = 1;
			if (this.isType("character"))
				this.resetSickness();
		}
		/*if (former != null && !destroyed)
			Notify ("card.move", former, value);
		if (location is Tile)
			lastTileOn = location as Tile;*/
	}
	
	resetBody () {

		let wasActivated = this.activated;
		if (this.passives)
			this.passives.forEach(passive => passive.deactivate());
		if (this.activated)
			this.deactivate();
		for (var k in this.model) {
			this[k] = this.model[k];
			if (!isNaN(this[k]))
				this[k] = parseFloat(this[k], 10);
		}
		delete this.supercode;
		this.blueprint = this.modelblueprint;
		this.faculties = [];
		this.mutations = [];
		this.cmutations = [];
		this.passives = [];
		this.events = [];
		this.states = {};
		this.originalMana = this.mana;
		this.originalAtk = this.atk;
		this.originalHp = this.hp;
		this.originalRange = this.range;
		delete this.poisondmg;
		this.shield = false;
		this.silenced = false;
		this.targets = [];
		delete this.variables;
		delete this.mutatedState;
		delete this.mutdata;
		delete this.lastwill;
		if (this.isType("entity") || this.isType("secret"))
			this.targets.push(Event.targets.friendlyEmpty);
		this.clearBoardInstance();
		if (wasActivated)
			this.activate();
		if (this.blueprint)
			Reader.read(this.blueprint, this);
		if (this.isType("secret")) {
			if (this.faculties.length === 2)
				this.secreteffect = 0;
			else delete this.secreteffect;
			this.secretcount = 1;
		}
		this.update();
	}

	destroy () {

		if (this.destroyed)
			return;
		var onBoard = this.onBoard;
		//if (this.area)
			//this.area.gameboard.notify("destroycard", this.id);
		this.clearBoardInstance();
		if (this.area)
			this.goto(onBoard ? this.area.cemetery : this.area.discard)
		else
			this.goto(null);
		this.gameboard.update();
	}

	freeze () {

		this.states.frozen = true;
		this.update();
	}

	get frozen () {

		return this.hasState("frozen") ? true : false;
	}

	get exalted () {

		return this.hasState("exaltation") ? true : false;
	}

	get concealed () {

		return this.hasState("concealed") ? true : false;
	}

	get immune () {

		return this.hasState("immune") ? true : false;
	}

	targetableBy (other) {

		return !this.exalted && !((this.area && other.area && this.area !== other.area) && (this.concealed || this.immune));
	}

	damage (dmg, src) {

		if (!this.chp || dmg <= 0)
			return;

		this.chp -= dmg;
		this.update();
		//this.area.gameboard.notify("damagecard", this.id, dmg, src.id);
	}

	heal (amt, src) {

		if (!this.chp || amt <= 0)
			return;

		if (this.isType("artifact"))
			this.chp += amt;
		else
			this.chp = Math.min(this.eff.hp, this.chp + amt);
		this.gameboard.update();
		//this.gameboard.notify("healcard", this.id, amt, src.id);
	}

	poison (psn) {


		if (!this.chp || psn <= 0 || this.isGhost)
			return;
		if (this.hasState("immune"))
			return;

		this.poisondmg = (this.poisondmg || 0) + psn;
		this.update();
		//this.gameboard.notify("poisoncard", this, psn);
	}

	get poisoned () {

		return this.poisondmg && this.poisondmg > 0;
	}

	curePoison (value) {

		if (value < 0 || !this.poisoned)
			return;
		if (value === null || value === undefined || value > this.poisondmg)
			value = this.poisondmg;

		this.poisondmg -= value;
		this.update();
		//this.gameboard.notify("curepoison", this, value);
	}

	boost (atk, hp, range) {

		if (atk === 0 && hp === 0 && range === 0)
			return;

		this.atk += atk;
		this.hp += hp;
		if (hp < 0 && !this.isType("artifact"))
			this.chp = Math.min(this.chp, this.eff.hp);
		this.range += range;
		this.update();
		//this.gameboard.notify("boostcard", this.id, atk, hp, range);
	}

	changeCost (value) {

		if (value === 0)
			return;

		this.mana += value;
		this.update();
		//this.gameboard.notify("changecost", this, value);
	}

	set (cost, atk, hp, range) {

		if (cost || cost === 0) {
			this.mana = cost;
			//this.originalMana = this.mana;
		}
		if (atk || atk === 0) {
			this.atk = atk;
			//this.originalAtk = this.atk;
		}
		if (hp || hp === 0) {
			this.hp = hp;
			this.chp = hp;
			//this.originalHp = this.hp;
			delete this.php;
		}
		if (range || range === 0) {
			this.range = range;
			//this.originalRange = this.range;
		}
		this.update();
		//this.gameboard.notify("setcard", this.id, cost, atk, hp, range);
	}

	boostoverload (value) {

		if (!value)
			return;

		this.ol += value;
		this.update();
		//this.gameboard.notify("overloadcard", this, value);
	}

	silence () {

		this.deactivate();
		this.faculties = [];
		this.mutations = [];
		this.cmutations = [];
		this.passives = [];
		this.events = [];
		this.states = {};
		delete this.poisondmg;
		delete this.blueprint;
		delete this.lastwill;
		delete this.variables;
		this.mana = this.originalMana;
		this.atk = this.originalAtk;
		this.hp = this.originalHp;
		this.range = this.originalRange;
		this.chp = Math.min(this.eff.hp, this.chp);
		this.silenced = true;
		this.activate();
		this.update();
	}

	get area () {

		return this.location ? this.location.area : null;
	}

	isType (type) {

		switch (type) {
		case "entity": return this.isType("character") || this.isType("artifact");
		case "character": return this.isType("hero") || this.isType("figure");
		default: return this.cardType === type;
		}
	}

	isArchetype (arc) {

		return this.archetypes && this.archetypes.includes(arc);
	}

	hasState (state) {

		return this.states && this.eff.states[state] ? true : false;
	}

	identify (data) {

		if (this.nameCard)
			return;
		this.become(data);
	}

	become (data) {

		let wasActivated = this.activated;
		if (this.activated)
			this.deactivate();
		for (var k in data) {
			this[k] = data[k];
			if (!isNaN(this[k]))
				this[k] = parseFloat(this[k], 10);
		}
		if (this.idCardmodel)
			Library.getCard(this.idCardmodel, card => this.model = card);
		else
			this.model = data;
		if (data && data.blueprint)
			this.modelblueprint = data.blueprint;
		if (!data || !data.originalMana)
			this.originalMana = this.mana;
		if (!data || !data.originalAtk)
			this.originalAtk = this.atk;
		if (!data || !data.originalHp)
			this.originalHp = this.hp;
		if (!data || !data.originalRange)
			this.originalRange = this.range;
		this.targets = [];
		this.faculties = [];
		this.passives = [];
		this.mutations = [];
		this.cmutations = [];
		if (data && data.states)
			this.states = Object.assign({}, data.states);
		if (data && data.poisondmg)
			this.poisondmg = data.poisondmg;
		if (data && !data.blueprint)
			delete this.blueprint;
		if (wasActivated)
			this.activate();
		if (this.isType("entity") || this.isType("secret"))
			this.targets.push(Event.targets.friendlyEmpty);
		if (this.isType("hero")) {
			this.area.hero = this;
			this.chp = this.hp;
			this.actionPt = 1;
			this.skillPt = 1;
			this.activated = true;
			this.faculties.push({no: 0, desc: "Crée un réceptacle de mana.", cost: "!"});
			this.lv1 = {
				blueprint: this.blueprint,
				description: this.description,
				atk: this.atk,
				range: this.range,
				overload: this.overload
			}
		}
		if (this.blueprint)
			Reader.read(this.blueprint, this);
		if (this.isType("hero")) {
			let lvupf = this.faculties.find(f => f.desc.includes("Level Up") || f.desc.includes("Niveau Supérieur"));
			if (lvupf)
				lvupf.show = Object.assign({}, this, { level: this.level === 1 ? 2 : 3 });
		}
		if (this.isType("artifact") || this.isType("secret"))
			this.faculties.push({no: this.faculties.length, desc: "Explose.", cost: "0"});
		if (this.isType("secret")) {
			if (this.faculties.length === 2)
				this.secreteffect = 0;
			else delete this.secreteffect;
			this.secretcount = 1;
		}
		if (this.onBoard) {
			this.resetSickness();
			if (data && data.php) {
				this.mutatedState = this.mutatedState || {};
				this.mutatedState.hp = data.php.hp;
				this.mutatedState.chp = data.php.chp;
			}
		}
		this.update();
		if (data && data.chp) {
			this.chp = data.chp;
			this.update();
		}
	}

	levelUp (level) {

		if (!this.isType("hero"))
			return;

		var originallevel;
		if (!level)
			level = this.level + 1;
		if (level === this.level)
			return;
		this.level = level;
		var lv = this.level === 1 ? this.lv1 : (this.level === 2 ? this.lv2 : this.lvmax);
		if (!lv) {
			this.level = originallevel;
			return;
		}

		this.atk = parseInt(lv.atk, 10);
		this.range = parseInt(lv.range, 10);
		this.overload = parseInt(lv.overload, 10);
		this.originalAtk = this.atk;
		this.originalRange = this.range;
		this.blueprint = lv.blueprint;
		this.states = {};
		this.targets = [Event.targets.friendlyEmpty];
		this.faculties = [{no: 0, desc: "Crée un réceptacle de mana.", cost: "!"}];

		if (this.blueprint)
			Reader.read(this.blueprint, this);
		if (this.isType("hero")) {
			let lvupf = this.faculties.find(f => f.desc.includes("Level Up") || f.desc.includes("Niveau Supérieur"));
			if (lvupf)
				lvupf.show = Object.assign({}, this, { level: this.level === 1 ? 2 : 3 });
		}
		if (this.isType("artifact"))
			this.faculties.push({no: this.faculties.length, desc: "Explose.", cost: "0"});
		this.gameboard.update();
	}

	levelDown () {

		if (!this.isType("hero"))
			return;
		if (this.level === 0)
			return;
		this.levelUp(this.level - 1);
	}

	get canBePaid () {

		return (!isNaN(this.mana) || this.eff.mana === 0) && this.area && this.eff.mana <= this.area.manapool.usableMana;
	}

	get canBePlayed () {

		if (!this.inHand || !this.canBePaid || !this.area.isPlaying)
			return false;
		if (this.targets.length === 0)
			return true;

		return this.area.gameboard.tiles.some(t => this.canBePlayedOn([t]));
	}

	canBePlayedOn (targets) {

		if (!this.canBePaid || !this.area.isPlaying)
			return false;
		if (this.targets.length === 0)
			return true;
		if (targets.length === 0)
			return false;
		if (targets.length > 1 && targets.some((t, i) => targets.indexOf(t) !== i))
			return false;

		return targets.every((t, i) => this.targets[i](this, t));
	}

	play (targets) {

		/*this.area.manapool.use(this.mana);console.log(this.overload);
		switch(this.cardType) {
		case "figure":
			this.summon(targets[0]);
			if (this.event)
				this.event.execute(this.gameboard, targets ? targets[1] : undefined);
			break;
		case "spell":
			this.goto(this.area.court);
			if (this.event)
				this.event.execute(this.gameboard, targets ? targets[0] : undefined);
			this.destroy();
			break;
		default: break;
		}*/
		this.gameboard.update();
	}

	possibleTargets (targets) {

		return this.gameboard.tiles.filter(tile => targets(this, tile));
	}

	get canAct () {

		var eff = this.eff;

		if (!this.area.isPlaying)
			return false;
		if (!this.onBoard)
			return false;
		if (this.isType("secret"))
			return true;
		if (this.frozen)
			return false;
		if (eff.motionPt)
			return true;
		if ((eff.actionPt || (this.hasState("fury") && eff.furyState === 1)) && (!eff.firstTurn || this.hasState("rush")))
			return true;
		if (this.faculties.some(f => this.canUse(f)))
			return true;

		return false;
	}

	canUse (faculty) {

		if (!this.area.isPlaying)
			return false;
		if (this.isType("secret"))
			return this.secreteffect !== faculty.no;
		return (this.skillPt && !isNaN(faculty.cost) && (this.isType("artifact") ? this.eff.chp >= -faculty.cost : this.area.manapool.usableMana >= faculty.cost)) || (this.actionPt && isNaN(faculty.cost) && !this.firstTurn);
	}

	canAttack (target) {

		var eff = this.eff;

		if (!this.isType("character") || !this.onBoard || !target.onBoard || this.area === target.area || this.frozen || target.isType("secret") || eff.atk <= 0 || eff.range <= 0 || target.concealed || this.hasState("static") || this.hasState("passive"))
			return false;
		if (eff.firstTurn && !this.hasState("rush"))
			return false;
		if (!eff.actionPt && (!this.hasState("fury") || eff.furyState !== 1))
			return false;
		if (target.isType("hero") && this.hasState("cannot attack heroes"))
			return false;

		var needed = 1;
		if (this.location.inBack)
			needed++;
		if (target.isCovered(this.hasState("flying")))
			needed++;
		if (!this.hasState("flying") && target.hasState("flying"))
			needed++;

		return eff.range >= needed;
	}

	tryToCover (other, flying = false) {

		if (other.isEff)
			other = other.original;
		if (!this.isType("character") || !this.onBoard || !other.onBoard || this.concealed)
			return false;
		return (other.location.isBehind(this.location) || (this.hasState("cover neighbors") && other.location.isNeighborTo(this.location))) && flying === this.hasState("flying");
	}

	cover (other, flying = false) {

		if (other.isEff)
			other = other.original;
		return this.tryToCover(other, flying) && !other.tryToCover(this, flying);
	}

	get covered () {

		return this.isCovered();
	}

	isCovered (flying = false) {

		if (!this.onBoard)
			return false;
		return this.location.field.entities.some(e => e.cover(this, flying));
	}

	canMoveOn (tile) {

		if (!this.onBoard || !this.motionPt || this.frozen || tile.occupied || this.hasState("static"))
			return false;
		return this.location.isAdjacentTo(tile);
	}

	attack (auto) {

		if (auto)
			return;
		if (!this.hasState("fury") || this.furyState !== 1) {
			this.actionPt--;
			if (this.furyState === 0)
				this.furyState = 1; 
		} else if (!auto && this.hasState("fury") && this.furyState === 1) {
			this.furyState = 2;
		}
		this.motionPt = 0;
		this.gameboard.update();
	}

	addShield () {

		this.shield = true;
		this.update();
	}

	breakShield () {

		this.shield = false;
		this.update();
	}

	get hasShield () {

		return this.shield ? true : false;
	}

	move () {

		this.motionPt--;
		this.gameboard.update();
	}

	setState (state, value) {

		this.states = this.states || {};
		this.states[state] = value;
		this.update();
	}

	use (isAction) {

		if (isAction) {
			this.actionPt--;
			this.motionPt = 0;
			if (this.furyState === 1)
				this.furyState = 0;
		}
		else
			this.skillPt--;
	}

	get gameboard () {

		return this.location ? this.location.area.gameboard : null;
	}

	resetSickness () {

		this.actionPt = 1;
		this.skillPt = 1;
		this.motionPt = 0;
		this.firstTurn = true;
		this.furyState = 0;
	}

	setPoints (action, skill, motion) {

		this.actionPt = action;
		this.skillPt = skill;
		this.motionPt = motion;
		this.update();
	}

	refresh () {

		if (this.isType("entity")) {
			this.skillPt = 1;
			if (this.isType("character")) {
				this.actionPt = 1;
				this.motionPt = 1;
				this.firstTurn = false;
				this.furyState = 0;
			}
		}
	}

	mutate (effect, end) {

		var mut = new Mutation(effect);
		mut.attach(this);
		if (end)
			var unsub = end.subscribe((t,s,d) => {
				mut.detach();
				this.update();
				unsub();
			});
		this.gameboard.update();
	}

	transform (data) {

		delete this.variables;
		if (!data.idCardmodel)
			delete this.idCardmodel;
		this.become(data);
	}

	setVariable (name, value) {

		this.variables = this.variables || {};
		if (value === null || value === undefined) {
			delete this.variables[name];
			return;
		}
		switch (value.type) {
		case "card":
			value = this.area.gameboard.find(value);
			break;
		case "int":
			value = value.value;
			break;
		default: break;
		}
		this.variables[name] = value;
		this.gameboard.update();
	}

	getVariable (name) {

		return this.variables ? this.variables[name] : undefined;
	}

	activate () {

		if (this.activated)
			return;
		this.activated = true;
		if (this.passives)
			this.passives.forEach(passive => passive.activate());
		this.gameboard.update();
	}

	deactivate () {

		if (!this.activated)
			return;
		this.activated = false;
		if (this.passives)
			this.passives.forEach(passive => passive.deactivate());
		this.gameboard.update();
	}

	getEffects () {

		return this.blueprint.triggers.map(t => t.getBloc());
	}

	get eff () {

		var contacteffect = (eff) => {

			if (!this.oncontact)
				return eff;
			var res = Object.assign({}, eff);
			this.cmutations.forEach(cmut => {
				if (!cmut.targets || cmut.targets(this.oncontact))
					res = cmut.effect(res);
			});
			return res;
		}

		if (this.isEff || this.computing || !this.gameboard.started)
			return contacteffect(this.mutatedState || this);
		if (!this.nameCard)
			return contacteffect(this.mutatedState || this);
		if (!this.mutatedState)
			this.update();
		return contacteffect(this.mutatedState);
	}

	update () {

		if (this.gameboard && !this.gameboard.started)
			return;
		if (this.isEff)
			return;
		if (!this.nameCard)
			return;
		if (this.computing)
			return;
		this.computing = true;
		var wasCovering = this.hasState("cover neighbors");
		var res;
		res = Object.assign({}, this);
		res.isEff = true;
		res.original = this;
		res.states = Object.assign({}, this.states);
		let updatephp = () => {
			if (this.isType("character") && this.onBoard) {
				this.php = this.php || { hp: this.hp, chp: this.chp };
				var plushp = Math.max (0, res.hp - this.php.hp);
				this.chp = Math.min(res.hp, (this.chp || this.hp) + plushp);
				res.chp = this.chp;
				this.php = { hp: res.hp, chp: res.chp };
			}
		}
		this.gameboard.auras.forEach(aura => {
			if (aura.applicable(this))
				res = aura.apply(res);
		});
		if (!this.mutatedState)
			this.mutatedState = res;
		this.mutatedState.states = Object.assign({}, res.states);
		res = this.mutations.reduce((card, mut) => mut.apply(card), res);
		updatephp();
		if (this.states && this.states.frozen && !this.frozen)
			this.states.frozen = false;
		this.computing = false;

		this.mutatedState = res;

		if (!wasCovering && res.states["cover neighbors"])
			this.gameboard.update();
	}

	/*get eff () {

		if (this.computing)
			return this;
		this.computing = true;
		var res;
		if (this.isEff)
			res = this;
		else {
			res = Object.assign({}, this);
			res.isEff = true;
			res.states = Object.assign({}, this.states);
			res = this.mutations.reduce((card, mut) => mut(card), res);
		}
		this.computing = false;

		return res;
	}

	update () {}*/

	clearBoardInstance () {

		delete this.chp;
		delete this.php;
		delete this.actionPt;
		delete this.skillPt;
		delete this.motionPt;
		delete this.firstTurn;
		this.deactivate();
	}
}