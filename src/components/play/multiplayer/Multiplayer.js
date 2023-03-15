import React, { Component } from 'react';
import './Multiplayer.css';
import Nav from '../../nav/Nav';
//import MainButton from '../../buttons/MainButton';
import Back from '../../Back';
//import Deck from '../../cards/Deck';

import { read } from '../../../TextManager';

export default class Multiplayer extends Component {

  decks = JSON.parse(localStorage.getItem('decks'));

  constructor (props) {

    super(props)

    let activeDeck = localStorage.getItem('activedeck');
    if (!activeDeck) {
      localStorage.setItem('activedeck', this.decks[0].key);
      activeDeck = this.decks[0].key;
    }
    this.state = {
      deck: this.decks.filter(deck => deck.key === activeDeck)[0],
      mode: "ranked"
    }
  }

  render () {

    return (
      <div className="main-page multiplayer-page">
        <Nav/>
        <div className="main">
          <div className="multiplayer-mode-changes">
            <div onClick={() => this.setState({mode: this.state.mode === "ranked" ? "unranked" : "ranked"})} className="mode-change">⮜</div>
            <div onClick={() => this.setState({mode: this.state.mode === "ranked" ? "unranked" : "ranked"})} className="mode-change">⮞</div>
          </div>
          <div className="multiplayer-params">
            <div className="multiplayer-icon">
              <img alt="ranked play" src={ this.state.mode === "ranked" ? "/images/crown.png" : "/images/swords.png" }/>
            </div>
            <div className="multiplayer-title">{ read('menu/' + this.state.mode) }</div>

          </div>
          {/*<Deck src={this.state.deck}/>
          <div className="deck-list-carousel">
            <div className="card-list deck-list">
              {
                this.decks.map((deck, i) => <div key={i} className="listed-deck" onClick={() => {
                    localStorage.setItem('activedeck', deck.key);
                    this.setState({deck: this.decks.filter(d => d.key === deck.key)[0]});
                  }
                }><Deck src={deck}/></div>)
              }
              </div>
            </div>
            <div className="enter-world">
              <MainButton to="/game">{ read('nav/enter') }</MainButton>
            </div>*/}
        </div>
        <Back to="/play"/>
      </div>
    );
  }
}

