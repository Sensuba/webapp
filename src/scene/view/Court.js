import React, { Component } from 'react';
import './Court.css';
import Card from '../../components/cards/Card';
import Ability from '../../components/cards/Ability';

export default class Court extends Component {

  render () {

    let card = this.props.src;

    return (
      <div className="game-court">
      {
        card ?
        <div key={card.id ? card.id.no : "ability"}
        className={"game-court-card"}
        onClick={e => this.props.focus(card.id ? card.model : card)}
        >
          <div className={"game-card-wrapper"}>
          {
            card.id ? <Card src={card.eff}/> : (this.props.model.turnPlayer ? <Ability origin={this.props.model.turnPlayer.hero} colors={this.props.model.turnPlayer.hero.model.colors} src={card}/> : "")
          }
          </div>
        </div> : ""
      }
      </div>
    );
  }
}

