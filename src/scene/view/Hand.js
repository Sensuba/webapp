import React, { Component } from 'react';
import './Hand.css';
import Card from '../../components/cards/Card';

export default class Hand extends Component {

  render () {

    return (
      <div className="game-hand">
      {
        this.props.src.cards.map((c,i) =>
          <div key={c.id.no} draggable={!this.props.hidden}
          className={"game-hand-card" + (this.props.hidden || (this.props.src.player.canPlay(c) && this.props.src.player.playing) ? "" : " game-hand-card-unplayable")}
          onClick={e => { if (!this.props.hidden) this.props.onSelect(e, c); }}
          onTouchStart={e => { if (!this.props.hidden && this.props.src.player.canPlay(c) && this.props.src.player.playing) this.props.onGrab(c); }}
          onDragStart={e => { let img = new Image(); img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='; e.dataTransfer.setDragImage(img, 0, 0); if (!this.props.hidden && this.props.src.player.canPlay(c) && this.props.src.player.playing) { this.props.onGrab(c); } }}
          style={{width: "" + Math.min(Math.floor(100 / this.props.src.cards.length), 18) + "%"}}
          >
            <div id={"sensuba-card-" + c.id.no} className={"game-card-wrapper" + (this.props.isDragged(c) ? " invisible" : "")}>
              <Card src={this.props.hidden ? null : c.eff}/>
              { !this.props.hidden && c.hasState("temporary") ? <div className="game-temporary"/> : "" }
            </div>
          </div>)
      }
      </div>
    );
  }
}

