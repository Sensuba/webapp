var Hand = require("./Hand");
var Deck = require("./Deck");
var Court = require("./Court");
var Graveyard = require("./Graveyard");
var Discard = require("./Discard");
var Throne = require("./Throne");
var Hero = require("./Hero");

const MAX_GEMS = 3;
const MAX_RECEPTACLES = 10;

class Player {

	mana = 0;
	receptacles = 0;
	gems = 0;

	constructor (game, decklist) {

		if(!arguments.length) return;

		this.game = game;
		this.game.register(this, "player");
		this.hand = new Hand(this);
		this.deck = new Deck(this);
		this.court = new Court(this);
		this.graveyard = new Graveyard(this);
		this.discard = new Discard(this);
		this.throne = new Throne(this);
		new Hero(this, decklist.hero);
		this.deck.init(decklist.cards);
	}

	get playing () {

		return this.game.turnPlayer === this;
	}

	get actionable () {

		return this.playing && this.game.phase === "main";
	}

	get opponent () {

		return this.game.players.filter(p => p !== this)[0];
	}

	get nether () {

		return this.game.nether;
	}

	get tiles () {

		return this.game.field.tiles[this.id.no];
	}

	get units () {

		return this.tiles.reduce((acc, e) => acc.concat(e.cards), []);
	}

	get hero () {

		return this.throne.hero;
	}

	newTurn () {

		this.game.turnPlayer = this;
		this.game.phase = "start";
		this.game.notify("startup", this);
		this.units.forEach(unit => unit.refresh());
		this.hero.refresh();
		this.addMana(this.receptacles - this.mana);
		this.addReceptacles(1, true);
		this.game.notify("newturn", this);
		this.draw();
		this.game.notify("mainphase", this);
		this.game.phase = "main";
	}

	endTurn () {

		this.game.phase = "end";
		this.game.notify("endturn", this);
		this.units.forEach(unit => {
			if (unit.hasState("freeze") && unit.freezetimer) {
				delete unit.freezetimer;
				unit.setState("freeze", false);
			}
		})
		this.game.notify("cleanup", this);
		this.opponent.newTurn();
	}

	draw (n=1, filter) {

		let card = this.deck.draw(filter);
		if (!card)
			return;
		if (this.hand.isFull)
			card.discard();
		else this.hand.addCard(card);
		if (n > 1)
			this.draw(n-1, filter);
		else return card;
	}

	addMana (value) {

		if (value === 0)
			return;
		this.game.notify("addmana.before", this, value);
		this.mana += value;
		this.game.notify("addmana", this, value);
	}

	addReceptacles (value, filled) {

		if (value <= 0)
			return;
		this.game.notify("addreceptacles.before", this, value);
		value = Math.min(MAX_RECEPTACLES - this.receptacles, value);
		if (value <= 0)
			return;
		this.receptacles += value;
		this.game.notify("addreceptacles", this, value);
		if (filled)
			this.addMana(value);
	}

	addGems (value) {

		if (value <= 0)
			return;
		this.game.notify("addgems.before", this, value);
		value = Math.min(MAX_GEMS - this.gems, value)
		if (value <= 0)
			return;
		this.gems += value;
		this.game.notify("addgems", this, value);
	}

	removeGems (value) {

		value = Math.min(this.gems, value);
		if (value <= 0)
			return;
		this.game.notify("removegems.before", this, value);
		this.gems -= value;
		this.game.notify("removegems", this, value);
	}

	pay (value) {

		let manapaid = Math.min(value, this.mana);
		this.addMana(-manapaid);
		value -= manapaid;
		if (value <= 0)
			return;
		this.removeGems(value);
	}

	canPay (value) {

		return this.mana + this.gems >= value;
	}

	tryToPay (value) {

		if (!this.canPay(value))
			return false;
		this.pay(value);
		return true;
	}

	play (card, target) {

		this.pay(card.mana);
		this.game.notify("playcard", this, card, target ? target.data : undefined);
		switch (card.type) {
		case "unit":
			card.summon(this.tiles[target.data]);
			break;
		case "spell":
			card.cast(this, target);
			break;
		default: card.banish(); break;
		}
		if (card.type === "unit" && card.events) {
			if (card.hasTarget) {
				if (this.hasValidTargets(card)) {
					this.game.phase = "target";
					this.targeting = card;
					this.game.notify("targetphase", this, card);
				}
			}
			else card.events.forEach(e => e());
		}
	}

	canPlayTarget (target) {

		if (this.game.phase !== "target")
			return false;
		if (!this.playing)
			return false;

		return target !== undefined && this.targeting.canTarget(this, target);
	}

	tryToPlayTarget (target) {

		if (!this.canPlayTarget(target))
			return false;
		this.targeting.events.forEach(e => e(target.data));
		this.game.phase = "main";
		delete this.targeting;
		this.game.notify("mainphase", this);
		return true;
	}

	hasValidTargets (card) {

		if (card.targetType === "column")
			return this.game.field.columns.some(col => card.canTarget(this, {type: "column", data: col}));
		if (card.targetType === "card")
			return this.game.field.all.some(tile => tile.cards.some(c => card.canTarget(this, {type: "card", data: c}))) || card.canTarget(this, {type: "card", data: this.hero}) || card.canTarget(this, {type: "card", data: this.opponent.hero});

		return true;
	}

	canPlay (card) {
		
		if (!(this.actionable && card && card.location === this.hand && this.canPay(card.mana)))
			return false;
		if (card.isUnit)
			return this.tiles.some(tile => !tile.isFull);
		if (card.targetType === "column")
			return this.game.field.columns.some(col => card.canTarget(this, {type: "column", data: col}));
		if (card.targetType === "card")
			return this.game.field.all.some(tile => tile.cards.some(c => card.canTarget(this, {type: "card", data: c}))) || card.canTarget(this, {type: "card", data: this.hero}) || card.canTarget(this, {type: "card", data: this.opponent.hero});

		return true;
	}

	canPlayOn (card, target) {
		
		if (!(this.actionable && card && card.location === this.hand && this.canPay(card.mana)))
			return false;
		if (card.isUnit)
			return target !== undefined && target.type === "column" && !this.tiles[target.data].isFull;
		if (card.hasTarget)
			return target !== undefined && card.canTarget(this, target);

		return true;
	}

	tryToPlay (card, target) {

		if (!this.canPlayOn(card, target))
			return false;
		this.play(card, target);
		return true;
	}

	canLevelUp () {

		if (!this.hero)
			return false;
		if (this.hero.level === 3)
			return false;
		if (this.hero.skillUsed)
			return false;
		if (!this.actionable || !this.canPay(this.hero.levelUpMana))
			return false;
		return true;
	}

	levelUp () {

		this.pay(this.hero.levelUpMana);
		this.hero.levelUp();
	}

	tryToLevelUp () {

		if (!this.canLevelUp())
			return false;
		this.game.notify("leveluptrigger.before", this);
		this.hero.skillUsed = true;
		this.levelUp();
		this.game.notify("leveluptrigger", this);
		return true;
	}

	canUseSkill (no) {

		if (no !== 0 && no !== 1)
			return false;
		if (!this.hero || this.hero.level < 2)
			return false;
		if (this.hero.skills[this.hero.level-2].length-1 < no)
			return false;
		if (!this.actionable || !this.canPay(this.hero.skills[this.hero.level-2][no].mana))
			return false;
		if (this.hero.skillUsed)
			return false;
		if (this.hero.skills[this.hero.level-2][no].targetType === "column")
			return this.game.field.columns.some(col => this.hero.skills[this.hero.level-2][no].targetFunction(col));
		if (this.hero.skills[this.hero.level-2][no].targetType === "card")
			return this.game.field.all.some(tile => tile.cards.some(c => this.hero.skills[this.hero.level-2][no].targetFunction(c))) || this.hero.skills[this.hero.level-2][no].targetFunction(this.hero) || this.hero.skills[this.hero.level-2][no].targetFunction(this.opponent.hero);
		return true;
	}

	canUseSkillOn (no, target) {

		if (no !== 0 && no !== 1)
			return false;
		if (!this.hero || this.hero.level < 2)
			return false;
		if (this.hero.skills[this.hero.level-2].length-1 < no)
			return false;
		if (!this.actionable || !this.canPay(this.hero.skills[this.hero.level-2][no].mana))
			return false;
		if (this.hero.skillUsed)
			return false;
		if (this.hero.skills[this.hero.level-2][no].targetType)
			return target !== undefined && target.type === this.hero.skills[this.hero.level-2][no].targetType && this.hero.skills[this.hero.level-2][no].targetFunction(target.data);
		return true;
	}

	useSkill (no, target) {

		this.pay(this.hero.skills[this.hero.level-2][no].mana);
		this.game.notify("skilltrigger.before", this, no);
		this.hero.skillUsed = true;
		this.hero.useSkill(no, target);
		this.game.notify("skilltrigger", this, no);
	}

	tryToUseSkill (no, target) {

		if (!this.canUseSkillOn(no, target))
			return false;
		this.useSkill(no, target);
		return true;
	}

	attack (card) {

		if (!card.canAttack)
			return false;
		this.game.notify("attacktrigger.before", this, card);
		card.actioned = true;
		card.attack();
		this.game.notify("attacktrigger", this, card);
		return true;
	}

	move (card, right) {

		if (!card.canMove(right))
			return false;
		this.game.notify("movetrigger.before", this, card, right);
		card.summoningSickness = true;
		card.move(right);
		this.game.notify("movetrigger", this, card, right);
		return true;
	}

	serialize () {

		return {
			hand: this.hand.id.no,
			deck: this.deck.id.no,
			court: this.court.id.no,
			graveyard: this.graveyard.id.no,
			discard: this.discard.id.no,
			throne: this.throne.id.no,
			mana: this.mana,
			receptacles: this.receptacles,
			targeting: this.targeting ? this.targeting.id.no : undefined
		}
	}

	setup (game, data) {

		this.game = game;
		this.hand = game.find({type: "hand", no: data.hand});
		this.deck = game.find({type: "deck", no: data.deck});
		this.court = game.find({type: "court", no: data.court});
		this.graveyard = game.find({type: "graveyard", no: data.graveyard});
		this.discard = game.find({type: "discard", no: data.discard});
		this.throne = game.find({type: "throne", no: data.throne});
		this.hand.player = this;
		this.deck.player = this;
		this.court.player = this;
		this.graveyard.player = this;
		this.discard.player = this;
		this.throne.player = this;
		this.mana = data.mana;
		this.receptacles = data.receptacles;
		if (data.targeting)
			this.targeting = game.find({type: "card", no: data.targeting});
	}
}

module.exports = Player;