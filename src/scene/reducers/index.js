import Game from '../model/Game';
import Card from '../model/Card';

let reducer = (state = 0, n) => {

  switch (n.type) {
  case "gamestate": {
    state = Game.build(n.data);
    break;
  }
  case "startup": {
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
  case "summon": {
    let card = state.find(n.data[0]);
    delete card.actioned;
    card.summoningSickness = true;
    card.dmg = card.dmg || 0;
    card.activate();
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
  case "addeffect": {
    let card = state.find(n.data[0]);
    card.addEffect(n.data[1]);
    break;
  }
  case "switch": {
    let tile = state.find(n.data[0]);
    tile.switch();
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
  default: break;
  }

  if (state)
    state.update();

  return state;
}

export default reducer;