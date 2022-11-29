import React, { Component } from 'react';
import HeroCard from '../../components/cards/Hero';
import './Hero.css';

export default class Hero extends Component {

  render () {

    return (
      <div className="game-hero game-card-targetable" card-type={this.props.src.id.type} card-no={this.props.src.id.no} onClick={e => this.props.onSelect(e, this.props.src)}>
        <HeroCard level={this.props.src.level} src={this.props.src.model}/>
        { this.props.src.hp ? <div className="card-stat card-hp"><img className="card-stat-icon" alt="" src="/images/icons/heart.png"/><div className={"card-stat-value" + (this.props.src.dmg ? " card-stat-value-debuff" : (this.props.src.hp > this.props.src.model.hp ? " card-stat-value-buff" : ""))}>{this.props.src.currentHp}</div></div> : "" }
      </div>
    );
  }
}

