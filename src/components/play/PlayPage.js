import React, { Component } from 'react';
import './PlayPage.css';
import { Input } from 'reactstrap'
import Nav from '../Nav';
import Deck from '../decks/Deck';
import User from '../../services/User';
import MuteButton from '../../game/view/UI/MuteButton';

export default class PlayPage extends Component {

    core = this.props.cards.filter(card => card.core)


  formats = {
      standard: { name: "Standard", cardlist: /*this.core.concat(this.props.collection.map(el => Object.assign({count: el.number}, this.props.cards.find(card => card.idCardmodel === el.idCardmodel))).filter(el => !this.core.find(cc => cc.idCardmodel === el.idCardmodel)))*/this.props.cards },
      highlander: { name: "Highlander", cardlist: this.props.cards.filter(card => card.idCardmodel !== 787 && card.idCardmodel !== 1346) },
      display: { name: "Display", cardlist: this.props.cards },
      custom: { name: "Custom", cardlist: /*this.core.concat(this.props.collection.map(el => Object.assign({id: el.idCardmodel, count: el.number}, this.props.cards.find(card => card.idCardmodel === el.idCardmodel)))).filter(el => !this.core.find(cc => cc.idCardmodel === el.idCardmodel)).concat(this.props.customs)*/this.props.cards.concat(this.props.customs) }
    }

	constructor (props) {

		super(props);

    var decklist = User.isConnected() ? (User.getData().authorization >= 4 ? (this.props.decks || []) : (this.props.decks || []).filter(d => this.findFormat(d) !== "display").filter(d => Object.values(d.cards).reduce((a, b) => a + b, 0) === 30)) : [];
    if (this.props.cdecks && decklist.length === 0)
      decklist = decklist.concat(this.props.cdecks)

    this.state = { cards: this.props.cards.concat(this.props.customs) }
    
    var deck = User.getDeck();
    if (deck) {
      deck = JSON.parse(deck);
      if (deck.id === undefined) {
        if (decklist && decklist.length > 0)
          deck.id = decklist.reduce((max, el) => Math.max(max, el.idDeck), null);
      }
    }
    else if (decklist && decklist.length > 0) {
      this.setDeck(decklist[0], true, false, true);
      deck = decklist[0];
    }
    else
      deck = null;

    var cpu = User.getCPU();
    if (!User.isConnected())
      cpu = null;
    else if (cpu) {
      cpu = JSON.parse(cpu);
      if (cpu.id === undefined) {
        if (decklist && decklist.length > 0)
          cpu.id = decklist.reduce((max, el) => Math.max(max, el.idDeck), null);
      }
    }
    else if (decklist && decklist.length > 0) {
      this.setDeck(decklist[0], true, true, true);
      cpu = decklist[0];
    }
    else
      cpu = null;

    this.state.seeking = false;
    this.state.decklist = decklist;
    if (!this.state.deck)
      this.state.deck = deck;
    if (!this.state.cpu)
      this.state.cpu = cpu;
    this.state.filter = "";
    this.state.filterCPU = "";
	}

  seekGame (prv, auto) {

    if (this.state.seeking)
      return;
    var socket = this.props.getSocket();
    if (!socket.connected) {
      if (!auto) {
        window.reconnect();
        setTimeout(() => this.seekGame(prv, true), 800)
      }
      return;
    }
    console.log('Seeking ' + (prv ? 'private' : 'public') + ' game');
    socket.emit('seek', prv);
    var history = this.props.history;
    socket.on('assign', (res) => {
      if (this.state.seeking) {
        this.setState({seeking: false});
        history.push(`/play/${res.to}`);
      }
    });
    this.setState({seeking: true});
    setTimeout(() => {
      if (this.state.seeking) {
        if (!auto && socket.connected && socket === this.props.getSocket()) {
          window.disconnect();
          if (window.reconnect)
            window.reconnect();
          else this.setState({seeking: false})
          setTimeout(() => { this.setState({seeking: false}); this.seekGame(prv, true); this.setState({seeking: true}); }, 800)
        } else
          this.setState({seeking: false})
      }
    }, 1000)
  }

  callAI () {

    this.props.history.push(`/training`);
  }

  choice (idDeck, cpu) {

    if (idDeck === -1) {
      if (cpu) {
        User.updateCPU(null);
        this.setState({cpu: null});
      } else {
        User.updateDeck(null);
        this.setState({deck: null});
      }
    } else {
        this.setDeck(this.state.decklist.find(deck => deck.idDeck === idDeck), true, cpu);
    }
  }

  findFormat (deck) {

    var formats = [];
    Object.keys(this.formats).forEach(k => formats.push(k));

    var c = Object.keys(deck.cards);
    c.push(deck.hero);
    c.forEach (card => {
      formats.slice().forEach(f => {
        var cc = this.formats[f].cardlist.find(l => l && l.idCardmodel && l.idCardmodel.toString() === card.toString());
        if (!cc || (cc.count === 1 && deck.cards[card] > 1))
          formats.splice(formats.indexOf(f), 1);
      })
    });
    if (c.length > 30)
      formats = formats.filter(f => f !== "standard");

    return formats[0] || "display";
  }

  setDeck (deck, setState = true, cpu = false, creating = false) {

    var listsrc = setState ? this.state.cards : this.props.cards.concat(this.props.customs);
    var res = { id: deck.idDeck, hero: deck.hero, body: [] };
    var cc = listsrc.find(el => el.idCardmodel === parseInt(deck.hero, 10));
    if (cc && !cc.idEdition)
      res.hero = cc;
    Object.keys(deck.cards).forEach(c => {
        for (let i = 0; i < deck.cards[c]; i++) {
          cc = listsrc.find(el => el.idCardmodel === parseInt(c, 10));
          if (cc) {
            if (cc.idEdition)
              res.body.push(parseInt(c, 10));
            else
              res.body.push(cc);
          }
        }
    })
    if (cpu) {
      User.updateCPU(res);
      if (setState) {
        if (creating)
          /* eslint-disable */
          this.state.cpu = res;
          /* eslint-enable */
        else
          this.setState({cpu: res});
      }
    } else {
      User.updateDeck(res);
      if (setState) {
        if (creating)
          /* eslint-disable */
          this.state.deck = res;
          /* eslint-enable */
        else
          this.setState({deck: res});
      }
    }
  }

  render() {

    var colorIdToClassName = colorId => {

      switch (colorId) {
        case 0: return "neutral-mana";
        case 1: return "white-mana";
        case 2: return "red-mana";
        case 3: return "blue-mana";
        case 4: return "green-mana";
        case 5: return "black-mana";
        default: return "";
        }
      }

    let custom = false;
    if (this.state.deck)
      if (isNaN(this.state.deck.hero) || !this.state.deck.body || this.state.deck.body.find(c => isNaN(c)) || this.state.deck.body.length > 30)
        custom = true;

    return (
      <div>
        <Nav api={this.props.api} history={this.props.history}/>
      	<main>
          <div className="main-section">
            <MuteButton switch={() => {}} changeVolume={(volume, sfx) => {}}/>
            <div className="deck-selection-area">
            {
              this.state.deck ?
              <div className="deck-selection-memberlist">
                <div className="half-section">
                  <Deck defaultName="Deck par défaut" src={this.state.decklist ? this.state.decklist.find(deck => deck.idDeck === this.state.deck.id) : null}/>
                </div>
                <div className="half-section">
                  <div className="sensuba-deckbuilder-search">
                    <Input type="text" placeholder="Recherche" className="sensuba-deckbuilder-search-input" value={this.state.filter} onChange={e => this.setState({filter: e.target.value})}/>
                    <div className="sensuba-deckbuilder-search-list">
                    {
                      (this.state.decklist || []).filter(c => c.name.toLowerCase().includes(this.state.filter.toLowerCase())).map((c, i) => {
                        var hero;
                        var idHero = c.hero.idCardmodel || c.hero;
                        hero = this.state.cards.find(s => s && s.idCardmodel === idHero);
                        if (hero)
                        return (
                          <div key={i} className={"sensuba-deckbuilder-tag " + colorIdToClassName(hero.idColor) + " " + colorIdToClassName(hero.idColor2)} onClick={() => this.choice(c.idDeck)}>
                            <div className="sensuba-deckbuilder-tag-name">{(c.format === "common" ? "🔰 " : "") + c.name}</div>
                            <img className="sensuba-deckbuilder-tag-img" src={c.background} alt={c.name}/>
                          </div>
                        )
                        return null
                      })
                    }
                    </div>
                  </div>
                </div>
              </div>
              : <Deck/>
            }
            </div>
            <div className="play-panel-wrapper">
              <div onClick={() => { if (!custom) this.seekGame(false);}} className={"play-panel panel-left" + (custom ? " panel-lock" : "")}>
                <img className="play-panel-background" src="/play1.jpg" alt="bg"/>
                <div className="play-panel-text">
                  <h3>Partie rapide</h3>
                </div>
              </div>
              <div onClick={() => this.seekGame(true)} className="play-panel panel-right">
                <img className="play-panel-background" src="/play2.jpg" alt="bg"/>
                <div className="play-panel-text">
                  <h3>Partie privée</h3>
                </div>
              </div>
            </div>
            { /* <div className="rule-part">Jouez contre l'ordinateur</div>
            <div className="deck-selection-area">
            {
              <div className="deck-selection-memberlist">
                <div className="half-section">
                  <Deck defaultName="Aléatoire" src={this.state.decklist && this.state.cpu ? this.state.decklist.find(deck => deck.idDeck === this.state.cpu.id) : null}/>
                </div>
                <div className="half-section">
                  <div className="sensuba-deckbuilder-search">
                    <Input type="text" placeholder="Recherche" className="sensuba-deckbuilder-search-input" value={this.state.filterCPU} onChange={e => this.setState({filterCPU: e.target.value})}/>
                    <div className="sensuba-deckbuilder-search-list">
                    {
                      [{name: "Aléatoire", random: true}].concat(this.state.decklist || []).filter(c => c.name.toLowerCase().includes(this.state.filterCPU.toLowerCase())).map((c, i) => {
                        if (c.random)
                        return (
                          <div key={i} className={"sensuba-deckbuilder-tag " + colorIdToClassName(0)} onClick={() => this.choice(-1, true)}>
                            <div className="sensuba-deckbuilder-tag-name">{c.name}</div>
                            <img className="sensuba-deckbuilder-tag-img" src="/game/back.png" alt={c.name}/>
                          </div>
                        )
                        var hero;
                        var idHero = c.hero.idCardmodel || c.hero;
                        hero = this.state.cards.find(s => s.idCardmodel === idHero);
                        if (hero)
                        return (
                          <div key={i} className={"sensuba-deckbuilder-tag " + colorIdToClassName(hero.idColor) + " " + colorIdToClassName(hero.idColor2)} onClick={() => this.choice(c.idDeck, true)}>
                            <div className="sensuba-deckbuilder-tag-name">{c.name}</div>
                            <img className="sensuba-deckbuilder-tag-img" src={c.background} alt={c.name}/>
                          </div>
                        )
                        return null
                      })
                    }
                    </div>
                  </div>
                </div>
              </div>
            }
            </div>
            <div className="play-panel-wrapper">
              <div onClick={() => this.callAI()} className="play-panel panel-full">
                <img className="play-panel-background" src="/play3.png" alt="bg"/>
                <div className="play-panel-text">
                  <h3>Affronter l'ordinateur</h3>
                </div>
              </div>
            </div> */ }
          </div>
      	</main>
      </div>
    );
  }
}