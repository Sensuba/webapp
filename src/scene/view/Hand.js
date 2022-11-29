import React, { Component } from 'react';
import './Hand.css';
import Card from '../../components/cards/Card';

export default class Hand extends Component {

  render () {

    return (
      <div className="game-hand">
      {
        this.props.src.cards.map((c,i) =>
          <div key={c.id.no}
          className={"game-hand-card" + (this.props.hidden || (this.props.src.player.canPlay(c) && this.props.src.player.playing) ? "" : " game-hand-card-unplayable")}
          onClick={e => { if (!this.props.hidden) this.props.onSelect(e, c); }}
          onTouchStart={e => { if (!this.props.hidden && this.props.src.player.canPlay(c) && this.props.src.player.playing) this.props.onGrab(c); }}
          >
            <div id={"sensuba-card-" + c.id.no} className={"game-card-wrapper" + (this.props.isDragged(c) ? " invisible" : "")}>
              <Card src={this.props.hidden ? null : c}/>
            </div>
          </div>)
      }
      </div>
    );
  }
}

