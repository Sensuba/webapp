import React, { Component } from 'react';
import './Scene.css';
import Hand from './view/Hand';
import Field from './view/Field';
import Hero from './view/Hero';
import Abilities from './view/Abilities';

import { createStore } from 'redux';
import reducers from './reducers';

import SceneButton from '../components/buttons/SceneButton';
import Card from '../components/cards/Card';
import Ability from '../components/cards/Ability';
import CardBox from '../components/cards/CardBox';
import SocketManager from '../SocketManager';
import Sequencer from './Sequencer';

import PlayingState from './controller/state/PlayingState';
import TargetingState from './controller/state/TargetingState';
import WaitingState from './controller/state/WaitingState';
import MovingState from './controller/state/MovingState';

import { read } from '../TextManager';

export default class Scene extends Component {
	
  constructor (props) {

    super(props);

    this.store = createStore(reducers);
    this.store.subscribe(() => {
      this.setState({model: this.store.getState()}, () => { if (this.sequencer.resume) this.sequencer.resume(); });
    });

    this.noPlayer = 0;
    this.controller = new WaitingState(this);
    this.sequencer = new Sequencer(this, n => this.store.dispatch(n));

    this.io = SocketManager.master;
    this.io.onGameupdate = (type, data) => this.update(type, data);
    this.io.gamemode('room');

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

  focus (element) {

  	/*if (this.moving)
  		this.controller = new PlayingState(this, this.state.model);
    this.setState({focus: element, rotation: this.reverse ? 3 : 0, motion: null});*/
    this.setState({focus: element});
  }

  unfocus () {

    //this.setState({focus: null, subfocus: null, rotation: this.reverse ? 3 : 0, motion: null});
  	this.setState({focus: null});
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

  onSelect(e, element) {

    if (this.targeting && this.player.targeting && this.player.targeting.targetType === "card" && element.id && element.id.type === "card" && this.player.canPlayTarget({type: "card", data: element}))
      this.controller.act("target", {type: "card", data: element.id});
    else
  	 this.focus(element.model || element);
  	//this.controller.act("play", element);
  }

  deselect () {}

  updateDragStyle (e) {

  	let x = e.touches[0].pageX;
  	let y = e.touches[0].pageY;

  	this.dragged.current.style.left = x + "px";
  	this.dragged.current.style.top = y + "px";

    let type = this.grabbing.targetType;
    if (this.grabbing.isUnit)
      type = "column";
    if (this.grabbing.type === "skill")
      type = this.grabbing.model.targetType;

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

    let x = e.touches[0].pageX;
    let y = e.touches[0].pageY;

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
        let switchcommand = cardno && cardno != this.grabbing.id.no.toString();
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
        if (this.state.dragged.model.targetType) {
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

	render () {

		if (!this.state.model)
			return <div/>;

    let targetable = target => {

      if (this.targeting) {
        return this.player.targeting && this.player.targeting.targetType === "card" && this.player.canPlayTarget(target);
      }

      if (!this.state.dragged)
        return false;
      if (this.state.dragged.type === "skill") {
        if (this.state.dragged.model.targetType)
          return target !== undefined && target.type === this.state.dragged.model.targetType && this.state.dragged.model.targetFunction(target.data);
        return target === undefined;
      }
      if (this.grabbing.hasTarget)
        return this.grabbing.canTarget(this.player, target);
      return target === undefined && this.grabbing.isSpell;
    }

		return (
			<div className={"scene " + this.controller.name} onClick={() => this.deselect()} onTouchEnd={(e) => this.dragEnd(e)} onTouchCancel={(e) => this.dragEnd(e, true)} onTouchMove={e => this.drag(e)} onContextMenu={e => {this.deselect(); e.preventDefault();}}>
      { this.state.focus ? <CardBox src={this.state.focus} open={true} onClose={() => this.setState({focus:null})}/> : "" }
			<Field player={this.player} src={this.state.model.field} targeting={this.state.dragged || this.targeting} targetable={targetable} target={this.state.target} onSelect={this.onSelect.bind(this)} onGrab={e => this.grabbing = e}/>
        <div className="game-area self-area">
          <Hand src={this.player.hand} onGrab={e => this.grabbing = e} isDragged={c => c === this.state.dragged} onSelect={this.onSelect.bind(this)}/>
          <Hero src={this.player.hero} onSelect={this.onSelect.bind(this)}/>
          <Abilities levelup={() => this.controller.act("levelup")} hero={this.player.hero} onGrab={e => this.grabbing = e} onSelect={this.onSelect.bind(this)}/>
          <div className="game-area-data">
            <div className="game-area-data-stat game-area-data-mana"><img className="game-area-data-stat-icon" src='/images/icons/mana.png'/><div className="game-area-data-stat-value">{ this.player.mana + " / " + this.player.receptacles }</div></div>
            <div className="game-area-data-stat game-area-data-gems"><img className="game-area-data-stat-icon" src='/images/icons/gem.png'/><div className="game-area-data-stat-value">{ this.player.gems }</div></div>
            <div className="game-area-data-stat game-area-data-hand"><img className="game-area-data-stat-icon" src='/images/back.jpg'/><div className="game-area-data-stat-value">{ this.player.hand.count }</div></div>
            <div className="game-area-data-stat game-area-data-deck"><img className="game-area-data-stat-icon" src='/images/back.jpg'/><div className="game-area-data-stat-value">{ this.player.deck.count }</div></div>
          </div>
        </div>
        <div className="game-area opposite-area">
          <Hand src={this.player.opponent.hand} onGrab={e => {}} isDragged={c => false} hidden onSelect={this.onSelect.bind(this)}/>
          <Hero src={this.player.opponent.hero} onSelect={this.onSelect.bind(this)}/>
          <Abilities hero={this.player.opponent.hero} onGrab={e => {}} onSelect={this.onSelect.bind(this)}/>
          <div className="game-area-data">
            <div className="game-area-data-stat game-area-data-mana"><img className="game-area-data-stat-icon" src='/images/icons/mana.png'/><div className="game-area-data-stat-value">{ this.player.opponent.mana + " / " + this.player.opponent.receptacles }</div></div>
            <div className="game-area-data-stat game-area-data-gems"><img className="game-area-data-stat-icon" src='/images/icons/gem.png'/><div className="game-area-data-stat-value">{ this.player.opponent.gems }</div></div>
            <div className="game-area-data-stat game-area-data-hand"><img className="game-area-data-stat-icon" src='/images/back.jpg'/><div className="game-area-data-stat-value">{ this.player.opponent.hand.count }</div></div>
            <div className="game-area-data-stat game-area-data-deck"><img className="game-area-data-stat-icon" src='/images/back.jpg'/><div className="game-area-data-stat-value">{ this.player.opponent.deck.count }</div></div>
          </div>
        </div>
        <div className="game-buttons">
        	{/* <SceneButton onClick={() => this.controller.act('draw')}><img alt="cost-energy" src="/images/energy.png" id="draw-button-energy"/>&nbsp;:&nbsp;{ read('scene/draw') }</SceneButton> */}
        	{/*<SceneButton onClick={() => this.controller.act('channel')}>{ read('scene/channel') }</SceneButton>*/}
        	<SceneButton onClick={() => this.controller.act('endturn')}>{ read('scene/endturn') }</SceneButton>
        </div>
        <div className={"turn-indicator playing" + (this.player.playing ? "" : " fade")}>{ read('scene/yourturn') }</div>
        <div className={"turn-indicator" + (this.player.opponent.playing ? "" : " fade")}>{ read('scene/opponentsturn') }</div>
      <div ref={this.dragged} className="dragged-card">{this.state.dragged ? (this.state.dragged.type === "skill"  ? <Ability src={this.state.dragged.element}/> : <Card src={this.state.dragged}/>) : ""}</div>
	        </div>
		);
	}
}