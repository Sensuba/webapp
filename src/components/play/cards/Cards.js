import React, { Component } from 'react';
import { Input, Label, Button } from 'reactstrap';
import './Cards.css';
import Nav from '../../nav/Nav';
import Back from '../../Back';
import Card from '../../cards/Card';
import Hero from '../../cards/Hero';
import Deck from '../../cards/Deck';
import CardBox from '../../cards/CardBox';
import Library from '../../../scene/utility/Library';
import SocketManager from '../../../SocketManager';
import Lightbox from '../../utility/Lightbox';

import sorter from '../../cards/CollectionSorter';
import { read } from '../../../TextManager';

export default class Cards extends Component {

  state = {
    focus: null,
    deck: null,
    filter: {
      name: "",
      type: "",
      collectable: true,
      orderBy: "type"
    },
    hiding: {
      decks: false,
      heroes: false,
      white: false,
      red: false,
      blue: false,
      green: false,
      black: false
    },
    search: null
  }

  componentDidMount () {

    SocketManager.master.onDeckbuildUpdate = deck => this.setState({deck});
  }

  componentWillUnmount () {

    delete SocketManager.master.onDeckbuildUpdate;
  }

  capitalize (string) {

    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  render () {

    let cards = sorter.filter(Object.values(Library.cards), this.state.filter);
    let heroes = sorter.filter(Object.values(Library.heroes), Object.assign({}, this.state.filter, {orderBy: "color"}));
    let decks = JSON.parse(localStorage.getItem('decks'));

    let colors = {white: [], red: [], blue: [], green: [], black: []};
    Object.keys(colors).forEach(color => colors[color] = cards.filter(c => c.color === color));

    return (
      <div className="main-page cards-page">
        {
          this.state.focus ?
          <div>
            <CardBox src={this.state.focus} open={true} onClose={() => this.setState({focus:null})}/>
            {
              this.state.deck && !this.state.focus.colors ?
              <div className="cards-page-cardcountbuilder">
                <div onClick={() => { if (this.state.deck.body.cards.filter(key => key === this.state.focus.key).length > 0) SocketManager.master.deckbuild("removecard", this.state.deck.key, this.state.focus.key);} } className={"cards-page-cardcountbutton " + (this.state.deck.body.cards.filter(key => key === this.state.focus.key).length <= 0 ? "cards-page-cardcountbuttonlock" : "")}>-</div>
                <div className="cards-page-cardcount">{this.state.deck.body.cards.filter(key => key === this.state.focus.key).length}</div>
                <div onClick={() => { if (this.state.deck.body.cards.filter(key => key === this.state.focus.key).length < 2) SocketManager.master.deckbuild("addcard", this.state.deck.key, this.state.focus.key);} } className={"cards-page-cardcountbutton " + (this.state.deck.body.cards.filter(key => key === this.state.focus.key).length >= 2 ? "cards-page-cardcountbuttonlock" : "")}>+</div>
              </div>
              : ""
          }
          </div>
          : ""
        }
        <Lightbox className="new-deck-chose-hero-box" open={this.state.newdeck} onClose={() => this.setState({newdeck: false})}>
          <h2>{ read('menu/chosehero') }</h2>
          <div className="card-list">
          {
            heroes.map((hero, i) => <div key={i} className="listed-card" onClick={() => {
              SocketManager.master.deckbuild("newdeck", read('menu/newdeckname'), hero.key);
              this.setState({newdeck: false});
            }}><Hero src={hero}/></div>)
          }
          </div>
        </Lightbox>
        <Nav/>
        <div className="main">
          <div className="cards-page-nav"></div>
          <div className="cards-page-search">
            <Lightbox className="small" open={this.state.search === "name"} onClose={() => this.setState({search: null})}>
              <div className="styleform">
                  <Label for="cards-page-search-name">
                <div className="label-input">{ read('menu/name') }</div>
                <Input onBlur={e => {this.state.filter.name = e.target.value; this.setState({filter: this.state.filter});}} id="cards-page-search-name" type="text" name="search" autoComplete="off"/>
                </Label>
              </div>
            </Lightbox>
            <Label for="cards-page-search-name" className="cards-page-search-tab" onClick={() => this.setState({search: "name"})}>
              <div className="cards-page-search-label">{ read('menu/name') }</div>
              <div className="cards-page-search-value">{ this.state.filter.name }</div>
            </Label>
            <Lightbox className="small" open={this.state.search === "type"} onClose={() => this.setState({search: null})}>
              <div className="selectbox">
                <Button onClick={() => { this.state.filter.type = ""; this.setState({filter: this.state.filter, search: null}); }}>_</Button>
                <Button onClick={() => { this.state.filter.type = "unit"; this.setState({filter: this.state.filter, search: null}); }}>{ this.capitalize(read("cards/unit")) }</Button>
                <Button onClick={() => { this.state.filter.type = "building"; this.setState({filter: this.state.filter, search: null}); }}>{ this.capitalize(read("cards/building")) }</Button>
                <Button onClick={() => { this.state.filter.type = "spell"; this.setState({filter: this.state.filter, search: null}); }}>{ this.capitalize(read("cards/spell")) }</Button>
              </div>
            </Lightbox>
            <div className="cards-page-search-tab" onClick={() => this.setState({search: "type"})}>
              <div className="cards-page-search-label">{ read('menu/type') }</div>
              <div className="cards-page-search-value">{ this.capitalize(this.state.filter.type) }</div>
            </div>
            <Lightbox className="small" open={this.state.search === "category"} onClose={() => this.setState({search: null})}>
              <div className="styleform">
                  <Label for="cards-page-search-category">
                <div className="label-input">{ read('menu/category') }</div>
                <Input onBlur={e => {this.state.filter.category = e.target.value; this.setState({filter: this.state.filter});}} id="cards-page-search-category" type="text" name="search" autoComplete="off"/>
                </Label>
              </div>
            </Lightbox>
            <Label for="cards-page-search-category" className="cards-page-search-tab" onClick={() => this.setState({search: "category"})}>
              <div className="cards-page-search-label">{ read('menu/category') }</div>
              <div className="cards-page-search-value">{ this.state.filter.category }</div>
            </Label>
            <Lightbox className="small" open={this.state.search === "orderBy"} onClose={() => this.setState({search: null})}>
              <div className="selectbox">
                <Button onClick={() => { this.state.filter.orderBy = "type"; this.setState({filter: this.state.filter, search: null}); }}>{ read("menu/type") }</Button>
                <Button onClick={() => { this.state.filter.orderBy = "name"; this.setState({filter: this.state.filter, search: null}); }}>{ read("menu/name") }</Button>
                <Button onClick={() => { this.state.filter.orderBy = "mana"; this.setState({filter: this.state.filter, search: null}); }}>{ read("menu/mana") }</Button>
              </div>
            </Lightbox>
            <div className="cards-page-search-tab" onClick={() => this.setState({search: "orderBy"})}>
              <div className="cards-page-search-label">{ read('menu/orderby') }</div>
              <div className="cards-page-search-value">{ this.state.filter.orderBy }</div>
            </div>
          </div>
          <div className="cards-page-list">
            <div className="cards-border" onClick={() => {this.state.hiding.decks = !this.state.hiding.decks; this.setState({hiding: this.state.hiding});}}><div className="cards-border-left">{ read('menu/decks') }</div><div className="cards-border-right">{this.state.hiding.decks ? "+" : "-"}</div></div>
            { this.state.hiding.decks ? "" :
            <div className="deck-list-carousel">
            <div className="card-list deck-list">
              <div className="listed-deck"><div onClick={() => this.setState({newdeck: true})} className="new-deck"/></div>
              {
                decks.map((deck, i) => <div key={i} className="listed-deck" onClick={() => {
                    if (this.state.deck && this.state.deck.key === deck.key)
                      this.setState({deck: null});
                    else this.setState({deck});
                  }
                }><Deck src={deck}/></div>)
              }
              </div>
            </div>
            }
            {
              this.state.deck ?
              <div className="deckbuilder">
                <div className="deckbuilder-nav">
                  <div className="deckbuilder-hero" onClick={() => this.setState({focus:Library.getHero(this.state.deck.body.hero)})}><Hero src={Library.getHero(this.state.deck.body.hero)}/></div>
                  <div className="deckbuilder-name"><Input type="text" defaultValue={this.state.deck.deckname} onBlur={e => {
                    if (this.state.deck.deckname !== e.target.value) {
                      if (e.target.value.length > 0)
                        SocketManager.master.deckbuild("rename", this.state.deck.key, e.target.value);
                      else e.target.value = this.state.deck.deckname
                    }
                  }}/></div>
                </div>
                <div className="card-list">
                {
                  this.state.deck.body.cards.map((card, i) => <div key={i} className="listed-card" onClick={() => this.setState({focus:Library.getCard(card)})}><Card src={Library.getCard(card)}/></div>)
                }
                </div>
              </div>
              : ""
            }
            <div className="cards-border" onClick={() => {this.state.hiding.heroes = !this.state.hiding.heroes; this.setState({hiding: this.state.hiding});}}><div className="cards-border-left">{ read('menu/heroes') }</div><div className="cards-border-right">{this.state.hiding.heroes ? "+" : "-"}</div></div>
                <div className={"card-list " + (this.state.hiding.heroes ? "invisible" : "")}>
                {
                  heroes.map((hero, i) => <div key={i} className="listed-card" onClick={() => this.setState({focus:hero})}><Hero src={hero}/></div>)
                }
                </div>
            <div className="cards-border"><div className="cards-border-left">{ read('menu/cards') }</div><div className="cards-border-right"></div></div>
            {
              Object.keys(colors).map(color => colors[color].length > 0 ? <div key={color} className="color-list">
                <div className="color-border" onClick={() => {this.state.hiding[color] = !this.state.hiding[color]; this.setState({hiding: this.state.hiding});}}><div className="cards-border-left">{ read('cards/' + color) }</div><div className="cards-border-right">{this.state.hiding[color] ? "+" : "-"}</div></div>
                <div className={"card-list " + (this.state.hiding[color] ? "invisible" : "")}>
                {
                  colors[color].map((card, i) => <div key={i} className="listed-card" onClick={() => this.setState({focus:card})}><Card src={card}/></div>)
                }
                </div>
              </div> : "")
            }
          </div>
          </div>
        <Back to="/play"/>
      </div>
    );
/*
    return (
      <div className="main-page cards-page">
        <Nav/>
        <div className="main">
          <div className="card-list">
          {
            Object.keys(cards).map(k => <div key={k} className="listed-card" onClick={() => this.setState({focus:cards[k]})}><Card src={cards[k]}/></div>)
          }
          </div>
          <div className="card-list-info">
            <div className="card-list-filter">
              <div className="card-list-filter-el">
                <Label for="search-type" className="card-filter-label">Type</Label>
                <Input id="search-type" value={this.state.filter.type ?? ""} type="select" onChange={e => this.setState({filter: Object.assign({}, this.state.filter, {type: e.target.value ? e.target.value : null})})}>
                  <option value="">{ "-" }</option>
                  <option value="breath">{ "Breath" }</option>
                  <option value="charm">{ "Charm" }</option>
                  <option value="structure">{ "Structure" }</option>
                </Input>
              </div>
              <div className="card-list-filter-el">
                <Label for="search-order" className="card-filter-label">Order</Label>
                <Input id="search-order" value={this.state.filter.orderBy ?? ""} type="select" onChange={e => this.setState({filter: Object.assign({}, this.state.filter, {orderBy: e.target.value ? e.target.value : null})})}>
                  <option value="name">{ "Name" }</option>
                  <option value="type">{ "Type" }</option>
                  <option value="energy">{ "Energy" }</option>
                </Input>
              </div>
            </div>
          </div>
        </div>
        <Back to="/play"/>
      </div>
    );*/
  }
}

