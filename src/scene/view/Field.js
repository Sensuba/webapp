import React, { Component } from 'react';
import './Field.css';
import Unit from './Unit';

export default class Field extends Component {

  render () {

    return (
      <div className={"game-field" + (this.props.targeting && this.props.targetable() ? (this.props.target && this.props.target.type === undefined ? " game-field-target" : " game-field-targetable") : "")}>
      {
        [0, 1, 2, 3, 4].map(c => 
          <div column={c}
          className={"game-field-column" + (this.props.targeting ? 
            (this.props.target && this.props.target.type === "column" && this.props.target.data === c ?
              " game-field-column-target" : (this.props.targetable({type: "column", data: c}) ? " game-field-column-targetable" : "")
            ) : "")}
          key={c}>
          { [this.props.player.opponent.id.no, this.props.player.id.no].map(p => <div player={p} className="game-field-tile" key={p}>
            { this.props.src.tiles[p][c].cards.map(card =>
              <div
              key={card.id.no}
              id={"sensuba-card-" + card.id.no}
              className={"game-card-wrapper" + (this.props.targeting ? (this.props.targetable({type: "card", data: card}) ? " game-card-targetable" : "") : "")} 
              onClick={e => this.props.onSelect(e, card)}
              onTouchStart={e => this.props.onGrab(card)}
              >
                <Unit src={card}/>
              </div>)
            }
          </div>)
          }
        </div>)
      }
      <div className="game-field-filter"/>
      </div>
    );
  }
}

