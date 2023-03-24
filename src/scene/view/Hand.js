import React, { Component } from 'react';
import './Hand.css';
import Card from '../../components/cards/Card';

export default class Hand extends Component {

  componentDidMount () {

    this.resizehandler = () => this.forceUpdate();
    window.addEventListener('resize', this.resizehandler);
  }

  componentWillUnmount () {

    window.removeEventListener('resize', this.resizehandler);
  }

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
          style={ window.innerWidth > 600 ?
            {left: "calc(50% " + (i < (this.props.src.cards.length-1)/2 ? "- " : "+ ") + (Math.abs(i - (this.props.src.cards.length-1)/2) * (9 + 25/this.props.src.cards.length)) + "% - 4em)"} :
            ( this.props.hidden ? {left: ((this.props.src.cards.length-i)*(4 + (10-this.props.src.cards.length)/2.5)) + "vw"} : {left: 1 + (((i%5)*19.5) + (5-(i>=5?(this.props.src.cards.length-5):Math.min(this.props.src.cards.length,5)))*9.75) + "vw", top: "" + (Math.floor(i/5)*50) + "%"} )
          }
          >
            <div id={"sensuba-card-" + c.id.no} className={"game-card-wrapper" + (this.props.isDragged(c) ? " invisible" : "") + (c.hasState('temporary') ? ' game-temporary' : '')}>
              <Card src={this.props.hidden ? null : c.eff}/>
              { !this.props.hidden && c.hasState("temporary") ? <div className="game-temporaryd"/> : "" }
            </div>
          </div>)
      }
      </div>
    );
  }
}

