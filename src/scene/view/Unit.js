import React, { Component } from 'react';
import './Unit.css';

export default class Unit extends Component {

  constructor (props) {

    super (props);

    this.interval = setInterval(() => {
      this.setState({tick: this.state.tick + 1});
    }, 2000);

    this.state = {
      tick: 0
    }
  }

  componentWillUnmount () {

    if (this.interval)
      clearInterval(this.interval)
  }

  updateAttack () {

    let states = [];
    ["reach", "drain", "agility", "initiative", "warden", "freeze", "trap"].forEach(s => {
      if (!this.props.src.hasState(s))
        return;
      states.push(s);
    });
    if (states.length <= 0)
      states.push("attack");
    
    this.attack = states;
  }

  updateHealth () {

    let states = [];
    ["shield", "ephemeral", "undying", "exalted", "hidden"].forEach(s => {
      if (!this.props.src.hasState(s))
        return;
      states.push(s);
    });
    if (states.length <= 0)
      states.push("heart");
    
    this.health = states;
  }

  render () {

    this.updateAttack();
    this.updateHealth();

    return (
      <div className={"game-unit game-card-targetable" + (this.props.src.player.playing && this.props.src.actioned ? " game-unit-actioned" : "") + (this.props.src.player.playing && (this.props.src.summoningSickness || (this.props.src.actioned && !this.props.src.hasState("agility"))) ? " game-unit-sickness" : "") + Object.keys(this.props.src.eff.states).filter(k => this.props.src.hasState(k)).reduce((acc, e) => acc + " state-" + e, "")} card-type={this.props.src.id.type} card-no={this.props.src.id.no}>
        <div className="card-image-wrapper no-select">
          <img className="card-image-wrapper no-select" alt="" src={this.props.src.model.img}/>
        </div>
        { this.props.src.hasState("shield") ? <div className="game-shield"/> : "" }
        { this.props.src.hasState("undying") ? <div className="game-undying"/> : "" }
        { this.props.src.hasState("exalted") ? <div className="game-exalted"/> : "" }
        { this.props.src.hasState("freeze") ? <div className="game-freeze"/> : "" }
        { this.props.src.hasState("agility") ? <div className="game-agility"/> : "" }
        { this.props.src.hasState("silence") ? <div className="game-silence"/> : "" }
        { this.props.src.hasState("lastwill") ? <div className="game-lastwill"><img className="card-lastwill-icon" src="/images/icons/lastwill.png" alt="last will"/></div> : "" }
        { this.props.src.eff.atk ? <div className="card-stat card-atk"><img className="card-stat-icon" alt="" src={"/images/icons/" + this.attack[this.state.tick % this.attack.length] + ".png"}/><div className={"card-stat-value" + (this.props.src.eff.atk < this.props.src.model.atk ? " card-stat-value-debuff" : (this.props.src.eff.atk > this.props.src.model.atk ? " card-stat-value-buff" : ""))}>{this.props.src.eff.atk || 0}</div></div> : "" }
        { this.props.src.eff.hp ? <div className="card-stat card-hp"><img className="card-stat-icon" alt="" src={"/images/icons/" + this.health[this.state.tick % this.health.length] + ".png"}/><div className={"card-stat-value" + (this.props.src.dmg ? " card-stat-value-debuff" : (this.props.src.eff.hp > this.props.src.model.hp ? " card-stat-value-buff" : ""))}>{this.props.src.currentHp || 0}</div></div> : "" }
        <div className="game-animmask"/><div className="game-digitanim"/>
      </div>
    );
  }
}

