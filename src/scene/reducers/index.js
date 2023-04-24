import Game from '../model/Game';
import Card from '../model/Card';
import Library from '../utility/Library';

let reducer = (state = 0, n) => {

  switch (n.type) {
  case "gamestate": {
    state = Game.build(n.data);
    break;
  }
  case "startup": {
    let player = state.find(n.data[0]);
    state.turnPlayer = player;
    state.phase = "start";
    break;
  }
  case "mainphase": {
    state.phase = "main";
    break;
  }
  case "targetphase": {
    state.phase = "target";
    let player = state.find(n.data[0]);
    player.targeting = state.find(n.data[1]);
    break;
  }
  case "endturn": {
    state.phase = "end";
    break;
  }
  case "newcard": {
    let card = new Card();
    card.setup(state, n.data[1]);
    card.id = {type:"card", no:n.data[0].no};
    state.data.card[n.data[0].no] = card;
    break;
  }
  case "newturn": {
    let player = state.find(n.data[0]);
    state.turnPlayer = player;
    state.priority = player;
    player.units.forEach(unit => unit.refresh());
    player.hero.refresh();
    break;
  }
  case "movecard": {
    let card = state.find(n.data[0]);
    let loc = state.find(n.data[2]);
    card.goto(loc);
    break;
  }
  case "playcard.before": {
    break;
  }
  case "playcard": {
    break;
  }
  case "summon": {
    let card = state.find(n.data[0]);
    delete card.actioned;
    card.summoningSickness = true;
    card.dmg = card.dmg || 0;
    card.activate();
    break;
  }
  case "predestroy": {
    let card = state.find(n.data[0]);
    card.sentenced = true;
    break;
  }
  case "damage": {
    let card = state.find(n.data[0]);
    card.dmg += n.data[1];
    break;
  }
  case "heal": {
    let card = state.find(n.data[0]);
    card.dmg -= n.data[1];
    break;
  }
  case "addstats": {
    let card = state.find(n.data[0]);
    card.addStats(n.data[1], n.data[2]);
    break;
  }
  case "setstats": {
    let card = state.find(n.data[0]);
    card.setStats(n.data[1], n.data[2], n.data[3]);
    break;
  }
  case "setstate": {
    let card = state.find(n.data[0]);
    card.setState(n.data[1], n.data[2]);
    break;
  }
  case "setdamage": {
    let card = state.find(n.data[0]);
    card.setDamage(n.data[1]);
    break;
  }
  case "silence": {
    let card = state.find(n.data[0]);
    card.silence();
    break;
  }
  case "shieldbreak": {
    let card = state.find(n.data[0]);
    delete card.states.shield;
    break;
  }
  case "changecost": {
    let card = state.find(n.data[0]);
    card.mana += n.data[1];
    break;
  }
  case "storevar": {
    let card = state.find(n.data[0]);
    let variable = n.data[2];
    variable = typeof variable === 'object' ? state.find(variable) : variable;
    card.setVariable(n.data[1], variable);
    break;
  }
  case "clearvar": {
    let card = state.find(n.data[0]);
    card.clearVariable(n.data[1]);
    break;
  }
  case "refreshskill": {
    let hero = state.find(n.data[0]);
    delete hero.skillUsed;
    break;
  }
  case "addeffect": {
    let card = state.find(n.data[0]);
    card.addEffect(n.data[1]);
    break;
  }
  case "transform": {
    let src = state.find(n.data[0]);
    let transform = state.find(n.data[1]);
    transform.location = src.location;
    let index = src.location.cards.indexOf(src);
    src.location.cards[index] = transform;
    src.location = src.game.nether;
    src.blueprints = [];
    break;
  }
  case "switch": {
    let tile = state.find(n.data[0]);
    tile.switch();
    break;
  }
  case "copy": {
    let src = state.find(n.data[0]);
    let card = state.find(n.data[1]);
    let serial = src.serialize();
    delete serial.model;
    delete serial.index;
    Object.keys(serial).forEach(key => card[key] = serial[key]);
    break;
  }
  case "addmana": {
    let player = state.find(n.data[0]);
    player.mana += n.data[1];
    break;
  }
  case "addreceptacles": {
    let player = state.find(n.data[0]);
    player.receptacles += n.data[1];
    break;
  }
  case "destroyreceptacles": {
    let player = state.find(n.data[0]);
    player.receptacles -= n.data[1];
    break;
  }
  case "setmaxmana": {
    let player = state.find(n.data[0]);
    player.maxMana = n.data[1];
    break;
  }
  case "addgems": {
    let player = state.find(n.data[0]);
    player.gems += n.data[1];
    break;
  }
  case "removegems": {
    let player = state.find(n.data[0]);
    player.gems -= n.data[1];
    break;
  }
  case "leveluptrigger":
  case "skilltrigger": {
    let player = state.find(n.data[0]);
    player.hero.skillUsed = true;
    break;
  }
  case "attacktrigger": {
    let card = state.find(n.data[1]);
    card.actioned = true;
    break;
  }
  case "movetrigger": {
    let card = state.find(n.data[1]);
    card.summoningSickness = true;
    break;
  }
  case "levelup": {
    let hero = state.find(n.data[0]);
    hero.level++;
    if (hero.level === 3)
      hero.passives.forEach(passive => passive.activate());
    break;
  }
  case "addchoosebox": {console.log(n.data);
    let choosebox = state.find(n.data[0]);
    choosebox.items.push({element: n.data[2] === "card" ? state.find(n.data[1]) : Library.getCard(n.data[1]), type: n.data[2]});
    break;
  }
  case "clearchoosebox": {
    let choosebox = state.find(n.data[0]);
    choosebox.items = [];
    break;
  }
  case "openchoosebox": {
    let choosebox = state.find(n.data[0]);
    choosebox.isOpen = true;
    state.phase = "choose";
    break;
  }
  case "closechoosebox": {
    let choosebox = state.find(n.data[0]);
    choosebox.isOpen = false;
    state.phase = "main";
    break;
  }
  default: break;
  }

  if (state) {
    state.broadcaster.trigger(n.type, n.data);
    state.update();
  }

  return state;
}

export default reducer;