import React, { Component } from 'react';
import './Multiplayer.css';
import Nav from '../../nav/Nav';
import MainButton from '../../buttons/MainButton';
import Back from '../../Back';
import Deck from '../../cards/Deck';
import Flowers from '../../other/flowers/Flowers';
import StoryText from '../../text/StoryText';
import SocketManager from '../../../SocketManager';
import Scene from '../../../scene/Scene';

import { read } from '../../../TextManager';

export default class Multiplayer extends Component {

  constructor (props) {

    super(props)

    let activeDeck = localStorage.getItem('activedeck');
    let decks = JSON.parse(localStorage.getItem('decks')).filter(deck => deck.body.cards.length === 30).sort((a, b) => a.deckname > b.deckname ? 1 : -1);
    if (activeDeck && !decks.some(deck => deck.key === activeDeck)) {
      localStorage.removeItem('activedeck')
      activeDeck = null;
    }
    if (!activeDeck) {
      if (decks.length > 0)
        localStorage.setItem('activedeck', decks[0].key);
      activeDeck = decks.length > 0 ? decks[0].key : undefined;
    }
    this.state = {
      decks,
      deck: decks.filter(deck => deck.key === activeDeck)[0],
      mode: "unranked",
      game: false
    }
  }

  updateDecks () {

    let activeDeck = localStorage.getItem('activedeck');
    let decks = JSON.parse(localStorage.getItem('decks')).filter(deck => deck.body.cards.length === 30).sort((a, b) => a.deckname > b.deckname ? 1 : -1);
    if (activeDeck && !decks.some(deck => deck.key === activeDeck)) {
      localStorage.removeItem('activedeck')
      activeDeck = null;
    }
    if (!activeDeck) {
      if (decks.length > 0)
        localStorage.setItem('activedeck', decks[0].key);
      activeDeck = decks.length > 0 ? decks[0].key : undefined;
    }

    this.setState({decks, deck: decks.filter(deck => deck.key === activeDeck)[0]})
  }

  componentDidMount () {

    SocketManager.master.onDeckbuildUpdate = deck => this.updateDecks();
  }

  componentWillUnmount () {

    delete SocketManager.master.onDeckbuildUpdate;
  }

  render () {

    if (this.state.game)
      return (
      <div className="main-page game-page">
        <Nav concede={ this.state.concede }/>
        <Scene setConcede={concede => this.setState({concede})} back={() => {
          if (!this.started)
            return;
          this.started = false;
          this.concede = null;
          document.getElementsByClassName("main-page")[0].classList.add("fade-out");
          setTimeout(() => {
            document.getElementsByClassName("main-page")[0].classList.remove("fade-out");
            this.setState({game: false});
          }, 500);
          
        }}/>
      </div>
    );

    return (
      <div className="main-page multiplayer-page">
        <Flowers/>
        <Nav/>
        <div className="main">
          {/* <div className="multiplayer-mode-changes">
            <div onClick={() => this.setState({mode: this.state.mode === "ranked" ? "unranked" : "ranked"})} className="mode-change"><img src="/images/arrowhead.png"/></div>
            <div onClick={() => this.setState({mode: this.state.mode === "ranked" ? "unranked" : "ranked"})} className="mode-change"><img src="/images/arrowhead.png"/></div>
          </div> */}
          <div className="multiplayer-params">
            <div className="multiplayer-icon">
              <img alt="ranked play" src={ this.state.mode === "ranked" ? "/images/crown.png" : "/images/swords.png" }/>
            </div>
            <div className="multiplayer-title">{ read('menu/' + this.state.mode) }</div>
            {
              this.state.deck ?
              <div className="multiplayer-deck-section">
                <div className="multiplayer-deck">
                  <Deck src={this.state.deck}/>
                </div>
                <div className="multiplayer-deck-select">
                    <div className="card-list deck-list">
                    {
                      this.state.decks.map((deck, i) => <div key={i} className="listed-deck" onClick={() => {
                          localStorage.setItem('activedeck', deck.key);
                          this.setState({deck: this.state.decks.filter(d => d.key === deck.key)[0]});
                        }
                      }><Deck src={deck}/></div>)
                    }
                    </div>
                </div>
              </div> :
              <div className="multiplayer-deck-section">
                <StoryText>{ read('messages/nodeck') }</StoryText>
              </div>
            }
            { this.state.deck ? <MainButton onClick={() => {
              if (this.started)
                return;
              this.started = true;
              document.getElementsByClassName("main-page")[0].classList.add("fade-out");
              setTimeout(() => {
                document.getElementsByClassName("main-page")[0].classList.remove("fade-out");
                this.setState({game: true});
              }, 500);
          }}>{ read('nav/enter') }</MainButton> : "" }
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

