import React, { Component } from 'react';
import './Unit.css';

export default class Unit extends Component {

  attackIcon () {

    let state = null;
    ["reach", "drain", "warden", "freeze", "agility"].forEach(s => {
      if (!this.props.src.hasState(s))
        return;
      if (state)
        state = "starattack";
      state = s;
    });
    
    return state || "attack";
  }

  healthIcon () {

    let state = null;
    ["shield", "ephemeral", "undying", "exalted"].forEach(s => {
      if (!this.props.src.hasState(s))
        return;
      if (state)
        state = "starhealth";
      state = s;
    });
    
    return state || "heart";
  }

  render () {

    return (
      <div className={"game-unit game-card-targetable" + (this.props.src.player.playing && (this.props.src.actioned || this.props.src.summoningSickness) ? " game-unit-actioned" : "") + Object.keys(this.props.src.eff.states).filter(k => this.props.src.hasState(k)).reduce((acc, e) => acc + " state-" + e, "")} card-type={this.props.src.id.type} card-no={this.props.src.id.no}>
        <div className="card-image-wrapper">
          <img alt="" src={this.props.src.model.img}/>
        </div>
        { this.props.src.hasState("shield") ? <div className="game-shield"/> : "" }
        { this.props.src.eff.atk ? <div className="card-stat card-atk"><img className="card-stat-icon" alt="" src={"/images/icons/" + this.attackIcon() + ".png"}/><div className={"card-stat-value" + (this.props.src.eff.atk < this.props.src.model.atk ? " card-stat-value-debuff" : (this.props.src.eff.atk > this.props.src.model.atk ? " card-stat-value-buff" : ""))}>{this.props.src.eff.atk || 0}</div></div> : "" }
        { this.props.src.eff.hp ? <div className="card-stat card-hp"><img className="card-stat-icon" alt="" src={"/images/icons/" + this.healthIcon() + ".png"}/><div className={"card-stat-value" + (this.props.src.dmg ? " card-stat-value-debuff" : (this.props.src.eff.hp > this.props.src.model.hp ? " card-stat-value-buff" : ""))}>{this.props.src.currentHp || 0}</div></div> : "" }
      </div>
    );
  }
}

