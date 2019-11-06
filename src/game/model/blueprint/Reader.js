var Bloc = require('./Bloc');
var Trigger = require('./Trigger');
var Data = require('./Data');

var State = require('./State');
var Variation = require('./Variation');
var Play = require('./Play');
var Action = require('./Action');
var Skill = require('./Skill');
var Listener = require('./Listener');
var LastWill = require('./LastWill');
var Trap = require('./Trap');
var Frenzy = require('./Frenzy');
var Contact = require('./Contact');
var PassiveMutation = require('./PassiveMutation');
var ContactMutation = require('./ContactMutation');
var Aura = require('./Aura');

var Draw = require('./Draw');
var Move = require('./Move');
var Damage = require('./Damage');
var Heal = require('./Heal');
var PushBack = require('./PushBack');
var PushForward = require('./PushForward');
var AddShield = require('./AddShield');
var BreakShield = require('./BreakShield');
var AddPoints = require('./AddPoints');
var Freeze = require('./Freeze');
var Silence = require('./Silence');
var SetCard = require('./Set');
var Boost = require('./Boost');
var ChangeCost = require('./ChangeCost');
var Overload = require('./Overload');
var Destroy = require('./Destroy');
var AddEffect = require('./AddEffect');
var LevelUp = require('./LevelUp');
var SetState = require('./SetState');
var Generate = require('./Generate');
var Summon = require('./Summon');
var Transform = require('./Transform');
var Copy = require('./Copy');
var AddMutation = require('./AddMutation');
var MutateNextCard = require('./MutateNextCard');
var CreateReceptacle = require('./CreateReceptacle');
var CreateGem = require('./CreateGem');
var DestroyGem = require('./DestroyGem');
var RefillMana = require('./RefillMana');
var ExtraMana = require('./ExtraMana');
var UseMana = require('./UseMana');
var StoreInteger = require('./StoreInteger');
var StoreCard = require('./StoreCard');
var StoreModel = require('./StoreModel');
var StoreLocation = require('./StoreLocation');
var ClearVariable = require('./ClearVariable');

var CanPay = require('./CanPay');
var FilterStats = require('./FilterStats');
var CheckCard = require('./CheckCard');
var CheckTile = require('./CheckTile');
var CheckLocation = require('./CheckLocation');
var CheckModel = require('./CheckModel');
var CompareCards = require('./CompareCards');
var CompareTiles = require('./CompareTiles');
var MergeCardFilters = require('./MergeCardFilters');
var MergeTileFilters = require('./MergeTileFilters');
var CompareLocations = require('./CompareLocations');
var MergeLocations = require('./MergeLocations');
var EditLocations = require('./EditLocations');
var ComparePlayers = require('./ComparePlayers');
var TileToTiles = require('./TileToTiles');
var CountCards = require('./CountCards');
var CountTiles = require('./CountTiles');
var CardToTileFilter = require('./CardToTileFilter');
var DoesCover = require('./DoesCover');
var IsCovered = require('./IsCovered');
var MergeMutations = require('./MergeMutations');
var ConditionalMutation = require('./ConditionalMutation');

var BreakCard = require('./BreakCard');
var BreakModel = require('./BreakModel');
var BreakTile = require('./BreakTile');
var BreakLocation = require('./BreakLocation');
var BreakPlayer = require('./BreakPlayer');

var Archetype = require('./Archetype');
var Analyse = require('./Analyse');
var InnerData = require('./InnerData');
var Token = require('./Token');
var Timestamp = require('./Timestamp');
var LimitBreak = require('./LimitBreak');
var ManaPool = require('./ManaPool');
var FindRandomCard = require('./FindRandomCard');
var FindRandomModel = require('./FindRandomModel');
var RandomInt = require('./RandomInt');
var RandomBool = require('./RandomBool');
var IntVariable = require('./IntVariable');
var CardVariable = require('./CardVariable');
var ModelVariable = require('./ModelVariable');
var LocationVariable = require('./LocationVariable');
var TriggerEffect = require('./TriggerEffect');

var Branch = require('./Branch');
var Loop = require('./Loop');
var AreaOfEffect = require('./AreaOfEffect');
var ForEachTile = require('./ForEachTile');
var ForEachEffect = require('./ForEachEffect');
var Timer = require('./Timer');

var ExtraTurn = require('./ExtraTurn');

var Plus = require('./Plus');
var Minus = require('./Minus');
var Times = require('./Times');
var Div = require('./Div');
var Mod = require('./Mod');
var Not = require('./Not');
var And = require('./And');
var Or = require('./Or');
var Xor = require('./Xor');
var Ternary = require('./Ternary');
var Equal = require('./Equal');
var NotEqual = require('./NotEqual');
var Greater = require('./Greater');
var GreaterEqual = require('./GreaterEqual');
var Lesser = require('./Lesser');
var LesserEqual = require('./LesserEqual');
var Max = require('./Max');
var Min = require('./Min');

class Reader {

	static read (blueprint, card) {

		var ctx = { triggers: [], actions: [], parameters: [] };
		Object.keys(ctx).forEach(key => blueprint[key].forEach((el,i) => {
			var bloc = null;
			switch(el.type) {
			case "state": bloc = new State(card, ctx); break;
			case "variation": bloc = new Variation(card, ctx); break;
			case "play": bloc = new Play(card, ctx, el.target); break;
			case "action": bloc = new Action(card, ctx, el.target); break;
			case "skill": bloc = new Skill(card, ctx, el.target); break;
			case "listener": bloc = new Listener(card, ctx); break;
			case "lw": bloc = new LastWill(card, ctx); break;
			case "trap": bloc = new Trap(card, ctx); break;
			case "frenzy": bloc = new Frenzy(card, ctx); break;
			case "contact": bloc = new Contact(card, ctx); break;
			case "passivemut": bloc = new PassiveMutation(card, ctx); break;
			case "contactmut": bloc = new ContactMutation(card, ctx); break;
			case "aura": bloc = new Aura(card, ctx); break;
			case "draw": bloc = new Draw(card, ctx); break;
			case "move": bloc = new Move(card, ctx); break;
			case "damage": bloc = new Damage(card, ctx); break;
			case "heal": bloc = new Heal(card, ctx); break;
			case "pushback": bloc = new PushBack(card, ctx); break;
			case "pushforward": bloc = new PushForward(card, ctx); break;
			case "addshield": bloc = new AddShield(card, ctx); break;
			case "breakshield": bloc = new BreakShield(card, ctx); break;
			case "set": bloc = new SetCard(card, ctx); break;
			case "boost": bloc = new Boost(card, ctx); break;
			case "changecost": bloc = new ChangeCost(card, ctx); break;
			case "overload": bloc = new Overload(card, ctx); break;
			case "silence": bloc = new Silence(card, ctx); break;
			case "freeze": bloc = new Freeze(card, ctx); break;
			case "destroy": bloc = new Destroy(card, ctx); break;
			case "levelup": bloc = new LevelUp(card, ctx); break;
			case "addeffect": bloc = new AddEffect(card, ctx); break;
			case "addmut": bloc = new AddMutation(card, ctx); break;
			case "mutnext": bloc = new MutateNextCard(card, ctx); break;
			case "addpoints": bloc = new AddPoints(card, ctx); break;
			case "setstate": bloc = new SetState(card, ctx); break;
			case "generate": bloc = new Generate(card, ctx); break;
			case "summon": bloc = new Summon(card, ctx); break;
			case "transform": bloc = new Transform(card, ctx); break;
			case "copy": bloc = new Copy(card, ctx); break;
			case "createreceptacle": bloc = new CreateReceptacle(card, ctx); break;
			case "creategem": bloc = new CreateGem(card, ctx); break;
			case "destroygem": bloc = new DestroyGem(card, ctx); break;
			case "createmana": bloc = new RefillMana(card, ctx); break;
			case "extramana": bloc = new ExtraMana(card, ctx); break;
			case "usemana": bloc = new UseMana(card, ctx); break;
			case "writeintvar": bloc = new StoreInteger(card, ctx); break;
			case "writecardvar": bloc = new StoreCard(card, ctx); break;
			case "writemodelvar": bloc = new StoreModel(card, ctx); break;
			case "writelocvar": bloc = new StoreLocation(card, ctx); break;
			case "trigger": bloc = new TriggerEffect(card, ctx); break;
			case "clearvar": bloc = new ClearVariable(card, ctx); break;
			case "canpay": bloc = new CanPay(card, ctx); break;
			case "checkcard": bloc = new CheckCard(card, ctx); break;
			case "checktile": bloc = new CheckTile(card, ctx); break;
			case "checkmodel": bloc = new CheckModel(card, ctx); break;
			case "checkloc": bloc = new CheckLocation(card, ctx); break;
			case "mergecfilters": bloc = new MergeCardFilters(card, ctx); break;
			case "mergetfilters": bloc = new MergeTileFilters(card, ctx); break;
			case "cmpcards": bloc = new CompareCards(card, ctx); break;
			case "cmptiles": bloc = new CompareTiles(card, ctx); break;
			case "cmplocations": bloc = new CompareLocations(card, ctx); break;
			case "mergeloc": bloc = new MergeLocations(card, ctx); break;
			case "editloc": bloc = new EditLocations(card, ctx); break;
			case "cmpplayers": bloc = new ComparePlayers(card, ctx); break;
			case "tiletotiles": bloc = new TileToTiles(card, ctx); break;
			case "filterstats": bloc = new FilterStats(card, ctx); break;
			case "countcards": bloc = new CountCards(card, ctx); break;
			case "counttiles": bloc = new CountTiles(card, ctx); break;
			case "ctotfilter": bloc = new CardToTileFilter(card, ctx); break;
			case "cover": bloc = new DoesCover(card, ctx); break;
			case "covered": bloc = new IsCovered(card, ctx); break;
			case "mergemut": bloc = new MergeMutations(card, ctx); break;
			case "conditionmut": bloc = new ConditionalMutation(card, ctx); break;
			case "archetype": bloc = new Archetype(card, ctx); break;
			case "analyse": bloc = new Analyse(card, ctx); break;
			case "innerdata": bloc = new InnerData(card, ctx); break;
			case "token": bloc = new Token(card, ctx); break;
			case "timestamp": bloc = new Timestamp(card, ctx); break;
			case "limitbrk": bloc = new LimitBreak(card, ctx); break;
			case "manapool": bloc = new ManaPool(card, ctx); break;
			case "intvar": bloc = new IntVariable(card, ctx); break;
			case "cardvar": bloc = new CardVariable(card, ctx); break;
			case "modelvar": bloc = new ModelVariable(card, ctx); break;
			case "locvar": bloc = new LocationVariable(card, ctx); break;
			case "findcard": bloc = new FindRandomCard(card, ctx); break;
			case "findmodel": bloc = new FindRandomModel(card, ctx); break;
			case "randint": bloc = new RandomInt(card, ctx); break;
			case "randbool": bloc = new RandomBool(card, ctx); break;
			case "brkcard": bloc = new BreakCard(card, ctx); break;
			case "brkmodel": bloc = new BreakModel(card, ctx); break;
			case "brktile": bloc = new BreakTile(card, ctx); break;
			case "brklocation": bloc = new BreakLocation(card, ctx); break;
			case "brkplayer": bloc = new BreakPlayer(card, ctx); break;
			case "branch": bloc = new Branch(card, ctx); break;
			case "loop": bloc = new Loop(card, ctx); break;
			case "timer": bloc = new Timer(card, ctx); break;
			case "aoe": bloc = new AreaOfEffect(card, ctx); break;
			case "fortile": bloc = new ForEachTile(card, ctx); break;
			case "foreffect": bloc = new ForEachEffect(card, ctx); break;
			case "extraturn": bloc = new ExtraTurn(card, ctx); break;
			case "opplus": bloc = new Plus(card, ctx); break;
			case "opminus": bloc = new Minus(card, ctx); break;
			case "optimes": bloc = new Times(card, ctx); break;
			case "opdiv": bloc = new Div(card, ctx); break;
			case "opmod": bloc = new Mod(card, ctx); break;
			case "opnot": bloc = new Not(card, ctx); break;
			case "opand": bloc = new And(card, ctx); break;
			case "opor": bloc = new Or(card, ctx); break;
			case "opxor": bloc = new Xor(card, ctx); break;
			case "opter": bloc = new Ternary(card, ctx); break;
			case "ope": bloc = new Equal(card, ctx); break;
			case "opne": bloc = new NotEqual(card, ctx); break;
			case "opg": bloc = new Greater(card, ctx); break;
			case "opge": bloc = new GreaterEqual(card, ctx); break;
			case "opl": bloc = new Lesser(card, ctx); break;
			case "ople": bloc = new LesserEqual(card, ctx); break;
			case "opmax": bloc = new Max(card, ctx); break;
			case "opmin": bloc = new Min(card, ctx); break;

			case "play-trigger": bloc = new Trigger(el.type, card, ctx, "playcard"); break;
			case "play-data": bloc = new Data(el.type, card, ctx, d => [d.src, d.data[0] ? d.data[0].card : null, d.data[0], d.data[0] !== null && d.data[0] !== undefined]); break;
			case "draw-trigger": bloc = new Trigger(el.type, card, ctx, "draw"); break;
			case "draw-data": bloc = new Data(el.type, card, ctx, d => [d.data[0], d.src]); break;
			case "move-trigger": bloc = new Trigger(el.type, card, ctx, "cardmove"); break;
			case "move-data": bloc = new Data(el.type, card, ctx, d => [d.src, d.data[1], d.data[0]]); break;
			case "attack-trigger": bloc = new Trigger(el.type, card, ctx, "charattack"); break;
			case "attack-data": bloc = new Data(el.type, card, ctx, d => [d.src, d.data[0]]); break;
			case "summon-trigger": bloc = new Trigger(el.type, card, ctx, "summon"); break;
			case "summon-data": bloc = new Data(el.type, card, ctx, d => [d.src, d.data[0]]); break;
			case "destroy-trigger": bloc = new Trigger(el.type, card, ctx, "destroycard"); break;
			case "destroy-data": bloc = new Data(el.type, card, ctx, d => [d.src, d.data[0].value]); break;
			case "damage-trigger": bloc = new Trigger(el.type, card, ctx, "damagecard"); break;
			case "damage-data": bloc = new Data(el.type, card, ctx, d => [d.src, d.data[1], d.data[0]]); break;
			case "heal-trigger": bloc = new Trigger(el.type, card, ctx, "healcard"); break;
			case "heal-data": bloc = new Data(el.type, card, ctx, d => [d.src, d.data[1], d.data[0]]); break;
			case "boost-trigger": bloc = new Trigger(el.type, card, ctx, "boostcard"); break;
			case "boost-data": bloc = new Data(el.type, card, ctx, d => [d.src, d.data[0], d.data[1], d.data[2]]); break;
			case "set-trigger": bloc = new Trigger(el.type, card, ctx, "setcard"); break;
			case "set-data": bloc = new Data(el.type, card, ctx, d => [d.src, d.data[0], d.data[1], d.data[2], d.data[3]]); break;
			case "addshield-trigger": bloc = new Trigger(el.type, card, ctx, "addshield"); break;
			case "addshield-data": bloc = new Data(el.type, card, ctx, d => [d.src]); break;
			case "breakshield-trigger": bloc = new Trigger(el.type, card, ctx, "breakshield"); break;
			case "breakshield-data": bloc = new Data(el.type, card, ctx, d => [d.src]); break;
			case "destroygem-trigger": bloc = new Trigger(el.type, card, ctx, "usegem"); break;
			case "destroygem-data": bloc = new Data(el.type, card, ctx, d => [d.src.area]); break;
			default: bloc = new Bloc(el.type, card, ctx); break;
			}
			ctx[key].push(bloc);
		}));
		Object.keys(ctx).forEach(key => blueprint[key].forEach((el, i) => {
			var bloc = ctx[key][i];
			bloc.updateIn(el.in);
		}));
		blueprint.triggers.forEach((trigger, i) => {
			var bloc = ctx.triggers[i];
			bloc.prepare(trigger, blueprint);
		})
		blueprint.basis.forEach(basis => {
			var bloc = ctx[basis.type][basis.index];
			bloc.setup(card);
		})
	}
}

module.exports = Reader;