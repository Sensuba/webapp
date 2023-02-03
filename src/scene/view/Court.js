import React, { Component } from 'react';
import './Court.css';
import Card from '../../components/cards/Card';

export default class Court extends Component {

  render () {

    let card = this.props.src.cards[0];

    return (
      <div className="game-court">
      {
        card ?
        <div key={card.id.no}
        className={"game-court-card"}
        onClick={e => { }}
        >
          <div id={"sensuba-card-" + card.id.no} className={"game-card-wrapper"}>
            <Card src={card.eff}/>
          </div>
        </div> : ""
      }
      </div>
    );
  }
}

