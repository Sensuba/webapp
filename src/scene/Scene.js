import React, { Component } from 'react';
import './Scene.css';
import Hand from './view/Hand';
import Court from './view/Court';
import Field from './view/Field';
import Hero from './view/Hero';
import Abilities from './view/Abilities';

import { createStore } from 'redux';
import reducers from './reducers';
import { Tooltip } from 'reactstrap';

import SceneButton from '../components/buttons/SceneButton';
import Card from '../components/cards/Card';
import Ability from '../components/cards/Ability';
import CardBox from '../components/cards/CardBox';
import SocketManager from '../SocketManager';
import Sequencer from './Sequencer';

import PlayingState from './controller/state/PlayingState';
import TargetingState from './controller/state/TargetingState';
import WaitingState from './controller/state/WaitingState';
//import MovingState from './controller/state/MovingState';

import { read } from '../TextManager';

export default class Scene extends Component {
	
  constructor (props) {

    super(props);

    this.store = createStore(reducers);
    this.store.subscribe(() => {
      this.setState({model: this.store.getState()}, () => { if (this.sequencer.resume) this.sequencer.resume(); });
    });

    this.volume = 1;
    this.noPlayer = 0;
    this.controller = new WaitingState(this);
    this.sequencer = new Sequencer(this, n => this.store.dispatch(n));

    this.io = SocketManager.master;
    this.io.onGameupdate = (type, data) => this.update(type, data);

    let decks = JSON.parse(localStorage.getItem('decks'))
    let activedeck = decks.filter(deck => deck.key === localStorage.getItem('activedeck'))[0].body;
    this.io.gamemode('room', activedeck);

    this.grabbing = null;
    this.dragged = React.createRef();
    this.state = { focus:null }
  }

  componentWillUnmount () {

  	this.io.exitGame();
  }

  get player () {

  	return this.state.model.players[this.noPlayer];
  }

  get playing () { return this.controller.name === "playing" }
  get targeting () { return this.controller.name === "targeting" }
  get waiting () { return this.controller.name === "waiting" }

  update (type, data) {

  	this.sequencer.add({type, data});
  	switch (type) {
	  case "mainplayer": {
	    this.noPlayer = data;
	    break;
	  }
    case "gamestate": {
      if (data.game.turnPlayer !== undefined && data.game.turnPlayer.toString() === this.noPlayer.toString()){
        this.controller = new PlayingState(this, this.state.model);
      }
      else
        this.controller = new WaitingState(this);
      break;
    }
    case "mainphase": {
      if (data[0].no.toString() === this.noPlayer.toString())
          this.controller = new PlayingState(this, this.state.model);
      break;
    }
    case "targetphase": {
      if (data[0].no.toString() === this.noPlayer.toString())
          this.controller = new TargetingState(this, this.state.model);
      break;
    }
	  case "endturn": {
	    if (data[0].no.toString() === this.noPlayer.toString())
	    	this.controller = new WaitingState(this);
	    break;
	  }
	  default: break;
	  }
  }

  get reverse () {

  	return this.noPlayer > 0 && this.state.model.players.length === 2;
  }

  focus (element, data) {

  	/*if (this.moving)
  		this.controller = new PlayingState(this, this.state.model);
    this.setState({focus: element, rotation: this.reverse ? 3 : 0, motion: null});*/
    this.setState({focus: element, focusdata: data});
  }

  unfocus () {

    //this.setState({focus: null, subfocus: null, rotation: this.reverse ? 3 : 0, motion: null});
  	this.setState({focus: null, focusdata: null});
  }
/*
  deselect () {

  	this.controller.deselect();
	  this.nav.current.close();
  }

  onSelect(e, element) {

  	this.controller.select(element);
  	this.nav.current.close();
  	e.stopPropagation();
  }*/

  onSelect(e, element, data) {

    if (element.type && element.type === "column") {
      if (this.targeting && this.player.targeting && this.player.targeting.targetType === "column" && this.player.canPlayTarget({type: "column", data: element.data}))
        this.controller.act("target", {type: "column", data: element.data});
    } else {
      if (this.targeting && this.player.targeting && this.player.targeting.targetType === "card" && element.id && (element.id.type === "card" || element.id.type === "hero") && this.player.canPlayTarget({type: "card", data: element}))
        this.controller.act("target", {type: "card", data: element.id});
      else
    	 this.focus(element.model || element, data);
    }
  	//this.controller.act("play", element);
  }

  deselect () {}

  updateDragStyle (e) {

    let touching = e.touches !== undefined;

  	let x = touching ? e.touches[0].pageX : e.pageX;
  	let y = touching ? e.touches[0].pageY : e.pageY;

  	this.dragged.current.style.left = touching ? x + "px" : "calc(" + x + "px - 4em)";
  	this.dragged.current.style.top = touching ? y + "px" : "calc(" + y + "px - 3em)";

    let type = this.grabbing.targetType;
    if (this.grabbing.isUnit)
      type = "column";
    if (this.grabbing.type === "skill")
      type = this.grabbing.no === "levelup" ? undefined : this.grabbing.model.targetType;

    if (type === "card") {

      let cards = document.elementsFromPoint(x, y).filter(el => el.classList.contains("game-card-targetable"));
      let cardtype = cards.length > 0 ? cards[0].getAttribute("card-type") : undefined;
      let cardno = cards.length > 0 ? parseInt(cards[0].getAttribute("card-no"), 10) : undefined;
      if (!cardtype) {
        if (this.state.target)
          this.setState({target: undefined});
      } else {
        let id = {type: cardtype, no: cardno};
        if (!this.state.target || !this.state.id || !(this.state.target.id.type === id.type && this.state.target.id.no === id.no))
          this.setState({target: {type: "card", data: this.state.model.find(id)}});
      }
      return;
    }

  	let columns = document.elementsFromPoint(x, y).filter(el => el.classList.contains("game-field-column"));
  	let col = columns.length > 0 ? parseInt(columns[0].getAttribute("column"), 10) : undefined;

  	if (col !== this.state.target)
  		this.setState({target: col === undefined ? undefined : {type: type, data: col}});
  }

  updateUnitCommandStyle (e) {

    let touching = e.touches !== undefined;

    let x = touching ? e.touches[0].pageX : e.pageX;
    let y = touching ? e.touches[0].pageY : e.pageY;

    let columns = document.elementsFromPoint(x, y).filter(el => el.classList.contains("game-field-column"));
    let col = columns.length > 0 ? parseInt(columns[0].getAttribute("column"), 10) : undefined;

    if (col === undefined) {
      if (this.state.command)
        this.setState({command: undefined});
      return;
    }

    let areas = document.elementsFromPoint(x, y).filter(el => el.classList.contains("game-field-tile"));
    let opposite = areas[0].getAttribute("player") !== this.noPlayer.toString();

    if (col === this.grabbing.location.x) {
      if (opposite) {
        if (this.state.command !== "attack")
          this.setState({command: "attack"});
      } else {
        let units = document.elementsFromPoint(x, y).filter(el => el.classList.contains("game-unit"));
        let cardno = units.length > 0 ? parseInt(units[0].getAttribute("card-no"), 10) : undefined;
        let switchcommand = cardno && cardno !== this.grabbing.id.no.toString();
        if (switchcommand) {
          if (this.state.command !== "switch")
            this.setState({command: "switch"});
        } else {
          if (this.state.command)
            this.setState({command: undefined});
        }
      }
    } else if (!opposite && col < this.grabbing.location.x) {
      if (this.state.command !== "moveleft")
        this.setState({command: "moveleft"});
    } else if (!opposite && col > this.grabbing.location.x) {
      if (this.state.command !== "moveright")
        this.setState({command: "moveright"});
    } else if (this.state.command)
        this.setState({command: undefined});
  }

  drag (e) {

  	if (!this.grabbing)
  		return;
    if (this.grabbing.inHand) {
      if (!this.state.dragged)
        this.setState({dragged: this.grabbing}, () => this.updateDragStyle(e));
      else this.updateDragStyle(e);
    } else if (this.grabbing.onField) {
      if (!this.state.commanding)
        this.setState({commanding: this.grabbing}, () => this.updateUnitCommandStyle(e));
      else this.updateUnitCommandStyle(e);
    } else if (this.grabbing.type === "skill") {
      if (!this.state.dragged)
        this.setState({dragged: this.grabbing}, () => this.updateDragStyle(e));
      else this.updateDragStyle(e);
    }
  }

  dragEnd (e, cancel=false) {

  	this.grabbing = null;
  	if (this.state.dragged || this.state.commanding)
  		this.setState({dragged: null, commanding: null, target: undefined, command: undefined});
    if (cancel)
      return;
  	if (this.state.target !== undefined) {
      if (this.state.dragged.type === "skill") {
        if (this.state.dragged.no === "levelup")
          this.controller.act("levelup");
        else if (this.state.dragged.model.targetType) {
          if (this.state.target.type === this.state.dragged.model.targetType && this.state.dragged.model.targetFunction(this.state.target.data))
            this.controller.act("skill", this.state.dragged.no, this.state.target && this.state.target.type === "card" ? {type: "card", data: this.state.target.data.id} : this.state.target)
        }
        else this.controller.act("skill", this.state.dragged.no);
      }
      else if (this.player.canPlayOn(this.state.dragged, this.state.target))
        this.controller.act("play", this.state.dragged, this.state.target && this.state.target.type === "card" ? {type: "card", data: this.state.target.data.id} : this.state.target);
  	} else if (this.state.command) {
      switch (this.state.command) {
      case "attack": this.controller.act("attack", this.state.commanding); break;
      case "moveleft": this.controller.act("move", this.state.commanding, false); break;
      case "moveright": this.controller.act("move", this.state.commanding, true); break;
      case "switch": this.controller.act("switch", this.state.commanding.location.x); break;
      default: break;
      }
    }
  }

  toggleTooltip (name) {

    this.setState({tooltip: this.state.tooltip === name ? undefined : name});
  }

	render () {

		if (!this.state.model)
			return <div/>;

    let targetable = target => {

      if (this.targeting) {
        if (!target || !this.player.targeting || this.player.targeting.targetType !== target.type)
          return false;
        return this.player.canPlayTarget(target);
      }

      if (!this.state.dragged)
        return false;
      if (this.state.dragged.type === "skill") {
        if (this.state.dragged.no === "levelup")
          return target === undefined;
        if (this.state.dragged.model.targetType)
          return target !== undefined && target.type === this.state.dragged.model.targetType && this.state.dragged.model.targetFunction(target.data);
        return target === undefined;
      }
      if (this.grabbing.hasTarget)
        return this.grabbing.canTarget(this.player, target);
      return target === undefined && this.grabbing.isSpell;
    }

		return (
			<div id="sensuba-scene" className={"scene " + this.controller.name} onClick={() => this.deselect()} onTouchEnd={(e) => this.dragEnd(e)} onDragEnd={(e) => this.dragEnd(e)} onTouchCancel={(e) => this.dragEnd(e, true)} onTouchMove={e => this.drag(e)} onDrag={e => this.drag(e)} onContextMenu={e => {this.deselect(); e.preventDefault();}}>
      { this.state.focus ? <CardBox src={this.state.focus} level={this.state.focusdata} open={true} onClose={() => this.setState({focus:null})}/> : "" }
			<Field player={this.player} src={this.state.model.field} targeting={this.state.dragged || this.targeting} targetable={targetable} target={this.state.target} onSelect={this.onSelect.bind(this)} onGrab={e => this.grabbing = e}/>
        <div className="game-area self-area">
          <Hand src={this.player.hand} onGrab={e => this.grabbing = e} isDragged={c => c === this.state.dragged} onSelect={this.onSelect.bind(this)}/>
          <Court src={this.player.court}/>
          <Hero src={this.player.hero} onSelect={this.onSelect.bind(this)}/>
          <Abilities levelup={() => this.controller.act("levelup")} hero={this.player.hero} onGrab={e => this.grabbing = e} onSelect={this.onSelect.bind(this)}/>
          <div className="game-area-data">
            <div id="game-area-data-mana" className="game-area-data-stat game-area-data-mana"><img alt="mana" className="game-area-data-stat-icon" src='/images/icons/mana.png'/><div className="game-area-data-stat-value">{ this.player.mana + (this.player.mana < 10 ? " " : "") + "/" + (this.player.receptacles < 10 ? " " : "") + this.player.receptacles }</div></div>
            <Tooltip className="tooltip game-area-data-tooltip" placement="top" target="game-area-data-mana" isOpen={this.state.tooltip === "mana"} toggle={() => this.toggleTooltip("mana")}>{ read('scene/mana') }</Tooltip>
            <div id="game-area-data-gems" className="game-area-data-stat game-area-data-gems"><img alt="gems" className="game-area-data-stat-icon" src='/images/icons/gem.png'/><div className="game-area-data-stat-value">{ this.player.gems }</div></div>
            <Tooltip className="tooltip game-area-data-tooltip" placement="top" target="game-area-data-gems" isOpen={this.state.tooltip === "gems"} toggle={() => this.toggleTooltip("gems")}>{ read('scene/gems') }</Tooltip>
            <div id="game-area-data-hand" className="game-area-data-stat game-area-data-hand"><img alt="cards in hand" className="game-area-data-stat-icon" src='/images/back.jpg'/><div className="game-area-data-stat-value">{ this.player.hand.count }</div></div>
            <Tooltip className="tooltip game-area-data-tooltip" placement="top" target="game-area-data-hand" isOpen={this.state.tooltip === "hand"} toggle={() => this.toggleTooltip("hand")}>{ read('scene/hand') }</Tooltip>
            <div id="game-area-data-deck" className="game-area-data-stat game-area-data-deck"><img alt="cards in deck" className="game-area-data-stat-icon" src='/images/back.jpg'/><div className="game-area-data-stat-value">{ this.player.deck.count }</div></div>
            <Tooltip className="tooltip game-area-data-tooltip" placement="top" target="game-area-data-deck" isOpen={this.state.tooltip === "deck"} toggle={() => this.toggleTooltip("deck")}>{ read('scene/deck') }</Tooltip>
          </div>
        </div>
        <div className="game-area opposite-area">
          <Hand src={this.player.opponent.hand} onGrab={e => {}} isDragged={c => false} hidden onSelect={this.onSelect.bind(this)}/>
          <Court src={this.player.opponent.court}/>
          <Hero src={this.player.opponent.hero} onSelect={this.onSelect.bind(this)}/>
          <Abilities hero={this.player.opponent.hero} onGrab={e => {}} onSelect={this.onSelect.bind(this)}/>
          <div className="game-area-data">
            <div id="game-area-data-mana-op" className="game-area-data-stat game-area-data-mana"><img alt="mana (opponent)" className="game-area-data-stat-icon" src='/images/icons/mana.png'/><div className="game-area-data-stat-value">{ this.player.opponent.mana + (this.player.opponent.mana < 10 ? " " : "") + "/" + (this.player.opponent.receptacles < 10 ? " " : "") + this.player.opponent.receptacles }</div></div>
            <Tooltip className="tooltip game-area-data-tooltip" placement="top" target="game-area-data-mana-op" isOpen={this.state.tooltip === "manaop"} toggle={() => this.toggleTooltip("manaop")}>{ read('scene/mana') }</Tooltip>
            <div id="game-area-data-gems-op" className="game-area-data-stat game-area-data-gems"><img alt="gems (opponent)" className="game-area-data-stat-icon" src='/images/icons/gem.png'/><div className="game-area-data-stat-value">{ this.player.opponent.gems }</div></div>
            <Tooltip className="tooltip game-area-data-tooltip" placement="top" target="game-area-data-gems-op" isOpen={this.state.tooltip === "gemsop"} toggle={() => this.toggleTooltip("gemsop")}>{ read('scene/gems') }</Tooltip>
            <div id="game-area-data-hand-op" className="game-area-data-stat game-area-data-hand"><img alt="cards in hand (opponent)" className="game-area-data-stat-icon" src='/images/back.jpg'/><div className="game-area-data-stat-value">{ this.player.opponent.hand.count }</div></div>
            <Tooltip className="tooltip game-area-data-tooltip" placement="top" target="game-area-data-hand-op" isOpen={this.state.tooltip === "handop"} toggle={() => this.toggleTooltip("handop")}>{ read('scene/hand') }</Tooltip>
            <div id="game-area-data-deck-op" className="game-area-data-stat game-area-data-deck"><img alt="cards in deck (opponent)" className="game-area-data-stat-icon" src='/images/back.jpg'/><div className="game-area-data-stat-value">{ this.player.opponent.deck.count }</div></div>
            <Tooltip className="tooltip game-area-data-tooltip" placement="top" target="game-area-data-deck-op" isOpen={this.state.tooltip === "deckop"} toggle={() => this.toggleTooltip("deckop")}>{ read('scene/deck') }</Tooltip>
          </div>
        </div>
        <div className="game-buttons">
        	{/* <SceneButton onClick={() => this.controller.act('draw')}><img alt="cost-energy" src="/images/energy.png" id="draw-button-energy"/>&nbsp;:&nbsp;{ read('scene/draw') }</SceneButton> */}
        	{/*<SceneButton onClick={() => this.controller.act('channel')}>{ read('scene/channel') }</SceneButton>*/}
        	<SceneButton onClick={() => this.controller.act('endturn')}>{ read('scene/endturn') }</SceneButton>
        </div>
        <div className={"turn-indicator playing" + (this.player.playing ? "" : " fade")}>{ read('scene/yourturn') }</div>
        <div className={"turn-indicator" + (this.player.opponent.playing ? "" : " fade")}>{ read('scene/opponentsturn') }</div>
      <div ref={this.dragged} className="dragged-card">{this.state.dragged ? (this.state.dragged.type === "skill"  ? <Ability src={this.state.dragged.element}/> : <Card src={this.state.dragged.eff}/>) : ""}</div>
	        </div>
		);
	}
}