var Bloc = require('./Bloc');
var Trigger = require('./Trigger');
var Data = require('./Data');

var Play = require('./Play');
var Skill = require('./Skill');
var Fanfare = require('./Fanfare');
var LastWill = require('./LastWill');
var Listener = require('./Listener');
var Aura = require('./Aura');
var PassiveMutation = require('./PassiveMutation');

var State = require('./State');
var Variation = require('./Variation');
var Armor = require('./Armor');
var Booster = require('./Booster');

var Send = require('./Send');
var Draw = require('./Draw');
var Damage = require('./Damage');
var Heal = require('./Heal');
var Destroy = require('./Destroy');
var Copy = require('./Copy');
var AddStats = require('./AddStats');
var SetStats = require('./SetStats');
var SetState = require('./SetState');
var AddEffect = require('./AddEffect');
var Enrage = require('./Enrage');
var Freeze = require('./Freeze');
var AddMana = require('./AddMana');
var AddReceptacle = require('./AddReceptacle');
var AddGem = require('./AddGem');
var Generate = require('./Generate');
var GenerateSummon = require('./GenerateSummon');
var Conjure = require('./Conjure');
var ChangeCost = require('./ChangeCost');
var Overload = require('./Overload');

var StoreInteger = require('./StoreInteger');
var StoreCard = require('./StoreCard');
var StoreModel = require('./StoreModel');
var StoreLocation = require('./StoreLocation');
var ClearVariable = require('./ClearVariable');

var Adjacents = require('./Adjacents');

var CompareCards = require('./CompareCards');
var ComparePlayers = require('./ComparePlayers');
var CountTiles = require('./CountTiles');
var EditTiles = require('./EditTiles');
var FilterCard = require('./FilterCard');
var FilterStats = require('./FilterStats');
var FilterDamaged = require('./FilterDamaged');
var FilterCover = require('./FilterCover');
var MergeCardFilters = require('./MergeCardFilters');
var MergeMutations = require('./MergeMutations');
var CheckCard = require('./CheckCard');
var CheckTile = require('./CheckTile');
var CheckColumn = require('./CheckColumn');
var ColumnSide = require('./ColumnSide');
var ColumnTiles = require('./ColumnTiles');
var AdjacentTiles = require('./AdjacentTiles');
var ConditionalMutation = require('./ConditionalMutation');

var Category = require('./Category');
var Boost = require('./Boost');
var CurrentPlayer = require('./CurrentPlayer');

var IntVariable = require('./IntVariable');
var CardVariable = require('./CardVariable');
var ModelVariable = require('./ModelVariable');
var LocationVariable = require('./LocationVariable');

var Timestamp = require('./Timestamp');
var RandomInt = require('./RandomInt');
var RandomBool = require('./RandomBool');
var FindCard = require('./FindCard');
var Extremum = require('./Extremum');
var InnerData = require('./InnerData');

var FactorOverload = require('./FactorOverload');

var Hand = require('./Hand');
var Model = require('./Model');

var BreakCard = require('./BreakCard');
var BreakTile = require('./BreakTile');

var If = require('./If');
var Timer = require('./Timer');
var ForEachCard = require('./ForEachCard');
var ForEachTile = require('./ForEachTile');

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

			case "play": bloc = new Play(card, ctx); break;
			case "skill": bloc = new Skill(card, ctx); break;
			case "fanfare": bloc = new Fanfare(card, ctx); break;
			case "lastwill": bloc = new LastWill(card, ctx); break;
			case "listener": bloc = new Listener(card, ctx); break;
			case "aura": bloc = new Aura(card, ctx); break;
			case "passivemut": bloc = new PassiveMutation(card, ctx); break;

			case "state": bloc = new State(card, ctx); break;
			case "variation": bloc = new Variation(card, ctx); break;
			case "armor": bloc = new Armor(card, ctx); break;
			case "booster": bloc = new Booster(card, ctx); break;

			case "send": bloc = new Send(card, ctx); break;
			case "draw": bloc = new Draw(card, ctx); break;
			case "damage": bloc = new Damage(card, ctx); break;
			case "heal": bloc = new Heal(card, ctx); break;
			case "destroy": bloc = new Destroy(card, ctx); break;
			case "copy": bloc = new Copy(card, ctx); break;
			case "addstats": bloc = new AddStats(card, ctx); break;
			case "setstats": bloc = new SetStats(card, ctx); break;
			case "setstate": bloc = new SetState(card, ctx); break;
			case "addeffect": bloc = new AddEffect(card, ctx); break;
			case "enrage": bloc = new Enrage(card, ctx); break;
			case "freeze": bloc = new Freeze(card, ctx); break;
			case "addmana": bloc = new AddMana(card, ctx); break;
			case "addrec": bloc = new AddReceptacle(card, ctx); break;
			case "addgem": bloc = new AddGem(card, ctx); break;
			case "generate": bloc = new Generate(card, ctx); break;
			case "generatesummon": bloc = new GenerateSummon(card, ctx); break;
			case "conjure": bloc = new Conjure(card, ctx); break;
			case "changecost": bloc = new ChangeCost(card, ctx); break;
			case "overload": bloc = new Overload(card, ctx); break;

			case "writeintvar": bloc = new StoreInteger(card, ctx); break;
			case "writecardvar": bloc = new StoreCard(card, ctx); break;
			case "writemodelvar": bloc = new StoreModel(card, ctx); break;
			case "writelocvar": bloc = new StoreLocation(card, ctx); break;
			case "clearvar": bloc = new ClearVariable(card, ctx); break;

			case "adjacents": bloc = new Adjacents(card, ctx); break;

			case "cmpcards": bloc = new CompareCards(card, ctx); break;
			case "cmpplayers": bloc = new ComparePlayers(card, ctx); break;
			case "counttiles": bloc = new CountTiles(card, ctx); break;
			case "edittiles": bloc = new EditTiles(card, ctx); break;
			case "filtercard": bloc = new FilterCard(card, ctx); break;
			case "filterstats": bloc = new FilterStats(card, ctx); break;
			case "filterdamaged": bloc = new FilterDamaged(card, ctx); break;
			case "filtercover": bloc = new FilterCover(card, ctx); break;
			case "mergecfilters": bloc = new MergeCardFilters(card, ctx); break;
			case "mergemut": bloc = new MergeMutations(card, ctx); break;
			case "checkcard": bloc = new CheckCard(card, ctx); break;
			case "checktile": bloc = new CheckTile(card, ctx); break;
			case "checkcolumn": bloc = new CheckColumn(card, ctx); break;
			case "columnside": bloc = new ColumnSide(card, ctx); break;
			case "columntiles": bloc = new ColumnTiles(card, ctx); break;
			case "adjacenttiles": bloc = new AdjacentTiles(card, ctx); break;
			case "conditionmut": bloc = new ConditionalMutation(card, ctx); break;

			case "category": bloc = new Category(card, ctx); break;
			case "boost": bloc = new Boost(card, ctx); break;
			case "current": bloc = new CurrentPlayer(card, ctx); break;

			case "intvar": bloc = new IntVariable(card, ctx); break;
			case "cardvar": bloc = new CardVariable(card, ctx); break;
			case "modelvar": bloc = new ModelVariable(card, ctx); break;
			case "locvar": bloc = new LocationVariable(card, ctx); break;

			case "timestamp": bloc = new Timestamp(card, ctx); break;
			case "randint": bloc = new RandomInt(card, ctx); break;
			case "randbool": bloc = new RandomBool(card, ctx); break;
			case "findcard": bloc = new FindCard(card, ctx); break;
			case "extremum": bloc = new Extremum(card, ctx); break;
			case "innerdata": bloc = new InnerData(card, ctx); break;

			case "factor": bloc = new FactorOverload(card, ctx); break;

			case "hand": bloc = new Hand(card, ctx); break;
			case "model": bloc = new Model(card, ctx); break;

			case "brkcard": bloc = new BreakCard(card, ctx); break;
			case "brktile": bloc = new BreakTile(card, ctx); break;

			case "if": bloc = new If(card, ctx); break;
			case "timer": bloc = new Timer(card, ctx); break;
			case "forcard": bloc = new ForEachCard(card, ctx); break;
			case "fortile": bloc = new ForEachTile(card, ctx); break;

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
			case "play-data": bloc = new Data(el.type, card, ctx, data => [data[0], data[1], data[2]]); break;
			case "damage-trigger": bloc = new Trigger(el.type, card, ctx, "damage"); break;
			case "damage-data": bloc = new Data(el.type, card, ctx, data => [data[0], data[2], data[1]]); break;
			case "attack-trigger": bloc = new Trigger(el.type, card, ctx, "attack"); break;
			case "attack-data": bloc = new Data(el.type, card, ctx, data => [data[0], data[1]]); break;

			default: bloc = new Bloc(el.type, card, ctx); break;
			}
			ctx[key].push(bloc);
		}));
		Object.keys(ctx).forEach(key => blueprint[key].forEach((el, i) => {
			var bloc = ctx[key][i];
			bloc.updateIn(el.in);
		}));
		ctx.blueprint = blueprint;
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