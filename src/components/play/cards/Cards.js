import React, { Component } from 'react';
import { Input, Label, Button, Tooltip } from 'reactstrap';
import './Cards.css';
import Nav from '../../nav/Nav';
import Back from '../../Back';
import Card from '../../cards/Card';
import Hero from '../../cards/Hero';
import Deck from '../../cards/Deck';
import CardBox from '../../cards/CardBox';
import MainButton from '../../buttons/MainButton';
import Library from '../../../scene/utility/Library';
import SocketManager from '../../../SocketManager';
import Lightbox from '../../utility/Lightbox';
import Loader from '../../utility/Loader';

import sorter from '../../cards/CollectionSorter';
import { read } from '../../../TextManager';

const PAGE_SIZE = 20;

export default class Cards extends Component {

  state = {
    focus: null,
    deck: null,
    tooltip: null,
    filter: {
      search: "",
      type: "",
      color: "",
      collectable: true,
      orderBy: "type"
    },
    hiding: {
      decks: true,
      heroes: false,
      white: false,
      red: false,
      blue: false,
      green: false,
      black: false
    },
    page: {
      heroes: 0,
      white: 0,
      red: 0,
      blue: 0,
      green: 0,
      black: 0
    },
    search: null,
    action: null,
    collection: JSON.parse(localStorage.getItem('collection'))
  }

  componentDidMount () {

    SocketManager.master.onDeckbuildUpdate = deck => {
      if (!deck) {
        this.setState({deck, action: null, waiting: false, newdeck: false});
      } else if (this.state.newdeck || (this.state.deck && deck.key === this.state.deck.key)) {
        this.setState({deck, action: null, waiting: false, newdeck: false});
        let deckname = document.getElementById("deckname-input");
        if (deckname)
          deckname.value = deck.deckname;
      } else
        this.forceUpdate()
    }
    SocketManager.master.onCollectionUpdate = collection => this.setState({collection, page: {heroes: 0, white: 0, red: 0, blue: 0, green: 0, black: 0}});
  }

  componentWillUnmount () {

    delete SocketManager.master.onDeckbuildUpdate;
  }

  capitalize (string) {

    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  render () {

    let cards = Object.values(Library.cards);
    cards = cards.filter(card => card.basic || this.state.collection.cards.includes(card.key));
    cards = sorter.filter(cards, this.state.filter);

    let allHeroes = Object.values(Library.heroes);
    let fullHeroes = allHeroes.filter(hero => hero.basic || this.state.collection.heroes.includes(hero.key))
    fullHeroes = sorter.filter(fullHeroes, Object.assign({}, this.state.filter, {orderBy: "color"}));

    if (this.state.deck && this.state.deck.body.hero) {
      let heroColors = allHeroes.find(hero => hero.key === this.state.deck.body.hero).colors
      cards = cards.filter(card => heroColors.some(c => c === card.color));
    }

    let heroes = fullHeroes.slice(PAGE_SIZE * this.state.page.heroes, PAGE_SIZE * this.state.page.heroes + 20);

    let decks = JSON.parse(localStorage.getItem('decks')) || [];

    let fullColors = {white: [], red: [], blue: [], green: [], black: []};
    Object.keys(fullColors).forEach(color => fullColors[color] = cards.filter(c => c.color === color));

    let colors = {};
    Object.keys(fullColors).forEach(color => {
      colors[color] = fullColors[color].slice(PAGE_SIZE * this.state.page[color], PAGE_SIZE * this.state.page[color] + 20);
    });

    let pages = { heroes: Math.ceil(fullHeroes.length / PAGE_SIZE) };
    Object.keys(fullColors).forEach(color => {
      pages[color] = Math.ceil(fullColors[color].length / PAGE_SIZE);
    });

    let decklist = {};
    let uniques = [];
    let sortedDeck = [];
    if (this.state.deck) {
      this.state.deck.body.cards.forEach(no => {
        if (!decklist[no]) {
          decklist[no] = 1;
          uniques.push(Library.getCard(no));
        }
        else
          decklist[no]++;
      });
      sortedDeck = sorter.sort(uniques, "type");
    }

    let left = null, right = null;
    if (this.state.focus) {
      if (!this.state.focus.type) {
        if (this.state.focusmode === 'collection') {
          let index = heroes.findIndex(hero => hero.key === this.state.focus.key);
          if (index >= 0) {
            if (index > 0)
              left = heroes[index-1];
            if (index < heroes.length-1)
              right = heroes[index+1];
          }
        }
      } else {
        if (this.state.focusmode === 'collection') {
          ["white", "red", "blue", "green", "black"].forEach(color => {
            let index = colors[color].findIndex(card => card.key === this.state.focus.key);
            if (index >= 0) {
              if (index > 0)
                left = colors[color][index-1];
              if (index < colors[color].length-1)
                right = colors[color][index+1];
            }
          })
        } else {
            let index = sortedDeck.findIndex(card => card.key === this.state.focus.key);
            if (index >= 0) {
              if (index > 0)
                left = sortedDeck[index-1];
              if (index < sortedDeck.length-1)
                right = sortedDeck[index+1];
            }
        }
      }
    }

    return (
      <div className="main-page cards-page">
        {
          this.state.focus ?
          <div>
            <CardBox left={left ? () => this.setState({focus:left}) : undefined} right={right ? () => this.setState({focus:right}) : undefined} src={this.state.focus} open={true} onClose={() => this.setState({focus:null})}/>
            {
              this.state.deck && !this.state.focus.colors && Library.getHero(this.state.deck.body.hero).colors.includes(this.state.focus.color) ?
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
              this.setState({waiting: true});
            }}><Hero src={hero}/></div>)
          }
          </div>
        </Lightbox>
        <Lightbox className="delete-box small" open={this.state.action === "delete"} onClose={() => this.setState({action: null})}>
          <h1>{ read('menu/askconfirmationdelete') }</h1>
          <MainButton color="red" onClick={() => { SocketManager.master.deckbuild("delete", this.state.deck.key); this.setState({waiting: true}); } }>{ read('menu/delete') }</MainButton>
        </Lightbox>
        {
          this.state.waiting ?
          <div className="lightbox-container">
            <div className="lightbox-inner">
              <Loader/>
            </div>
          </div>
          : ""
        }
        <Nav/>
        <div className="main">
          <div className="cards-page-nav"></div>
          <div className="cards-page-search">
            <div className="cards-page-search-main">
              <Lightbox className="small" open={this.state.search === "search"} onClose={() => this.setState({search: null})}>
                <div className="styleform">
                    <Label for="cards-page-search-search">
                  <div className="label-input">{ read('menu/search') }</div>
                  <Input onBlur={e => { this.setState({filter: Object.assign({}, this.state.filter, {search: e.target.value}), page: {heroes: 0, white: 0, red: 0, blue: 0, green: 0, black: 0}});}} id="cards-page-search-search" type="text" name="search" autoComplete="off"/>
                  </Label>
                </div>
              </Lightbox>
              <Label for="cards-page-search-search" className="cards-page-search-tab" onClick={() => this.setState({search: "search"})}>
                <div className="cards-page-search-label">{ read('menu/search') }</div>
                <div className="cards-page-search-value">{ this.state.filter.search }</div>
              </Label>
              <Lightbox className="small" open={this.state.search === "type"} onClose={() => this.setState({search: null})}>
                <div className="selectbox">
                  <Button onClick={() => { this.setState({filter: Object.assign({}, this.state.filter, {type: ""}), search: null, page: {heroes: 0, white: 0, red: 0, blue: 0, green: 0, black: 0}}); }}>_</Button>
                  <Button onClick={() => { this.setState({filter: Object.assign({}, this.state.filter, {type: "unit"}), search: null, page: {heroes: 0, white: 0, red: 0, blue: 0, green: 0, black: 0}}); }}>{ this.capitalize(read("cards/unit")) }</Button>
                  <Button onClick={() => { this.setState({filter: Object.assign({}, this.state.filter, {type: "spell"}), search: null, page: {heroes: 0, white: 0, red: 0, blue: 0, green: 0, black: 0}}); }}>{ this.capitalize(read("cards/spell")) }</Button>
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
                  <Input onBlur={e => { this.setState({filter: Object.assign({}, this.state.filter, {category: e.target.value}), page: {heroes: 0, white: 0, red: 0, blue: 0, green: 0, black: 0}});}} id="cards-page-search-category" type="text" name="search" autoComplete="off"/>
                  </Label>
                </div>
              </Lightbox>
              <Label id="cards-page-category-label" for="cards-page-search-category" className="cards-page-search-tab" onClick={() => this.setState({search: "category"})}>
                <div className="cards-page-search-label">{ read('menu/category') }</div>
                <div className="cards-page-search-value">{ this.state.filter.category }</div>
              </Label>
              <Lightbox className="small" open={this.state.search === "color"} onClose={() => this.setState({search: null})}>
                <div className="selectbox">
                  <Button onClick={() => { this.setState({filter: Object.assign({}, this.state.filter, {color: ""}), search: null}); }}>_</Button>
                  <Button onClick={() => { this.setState({filter: Object.assign({}, this.state.filter, {color: "white"}), search: null, page: {heroes: 0, white: 0, red: 0, blue: 0, green: 0, black: 0}}); }}>{ read("cards/white") }</Button>
                  <Button onClick={() => { this.setState({filter: Object.assign({}, this.state.filter, {color: "red"}), search: null, page: {heroes: 0, white: 0, red: 0, blue: 0, green: 0, black: 0}}); }}>{ read("cards/red") }</Button>
                  <Button onClick={() => { this.setState({filter: Object.assign({}, this.state.filter, {color: "blue"}), search: null, page: {heroes: 0, white: 0, red: 0, blue: 0, green: 0, black: 0}}); }}>{ read("cards/blue") }</Button>
                  <Button onClick={() => { this.setState({filter: Object.assign({}, this.state.filter, {color: "green"}), search: null, page: {heroes: 0, white: 0, red: 0, blue: 0, green: 0, black: 0}}); }}>{ read("cards/green") }</Button>
                  <Button onClick={() => { this.setState({filter: Object.assign({}, this.state.filter, {color: "black"}), search: null, page: {heroes: 0, white: 0, red: 0, blue: 0, green: 0, black: 0}}); }}>{ read("cards/black") }</Button>
                </div>
              </Lightbox>
              <Label for="cards-page-search-color" className="cards-page-search-tab" onClick={() => this.setState({search: "color"})}>
                <div className="cards-page-search-label">{ read('menu/color') }</div>
                <div className="cards-page-search-value">{ this.state.filter.color }</div>
              </Label>
              <Lightbox className="small" open={this.state.search === "orderBy"} onClose={() => this.setState({search: null})}>
                <div className="selectbox">
                  <Button onClick={() => { this.setState({filter: Object.assign({}, this.state.filter, {orderBy: "type"}), search: null, page: {heroes: 0, white: 0, red: 0, blue: 0, green: 0, black: 0}}); }}>{ read("menu/type") }</Button>
                  <Button onClick={() => { this.setState({filter: Object.assign({}, this.state.filter, {orderBy: "name"}), search: null, page: {heroes: 0, white: 0, red: 0, blue: 0, green: 0, black: 0}}); }}>{ read("menu/name") }</Button>
                  <Button onClick={() => { this.setState({filter: Object.assign({}, this.state.filter, {orderBy: "mana"}), search: null, page: {heroes: 0, white: 0, red: 0, blue: 0, green: 0, black: 0}}); }}>{ read("menu/mana") }</Button>
                </div>
              </Lightbox>
              <div className="cards-page-search-tab" onClick={() => this.setState({search: "orderBy"})}>
                <div className="cards-page-search-label">{ read('menu/orderby') }</div>
                <div className="cards-page-search-value">{ this.state.filter.orderBy }</div>
              </div>
            </div>
            <div className="cards-page-search-open-deckbuilder" onClick={() => { this.setState({hiding: Object.assign({}, this.state.hiding, {decks: !this.state.hiding.decks}), deck: (this.state.hiding.decks ? this.state.deck : null)});}}>
              <div className="cards-page-search-main-label">{ read('menu/deckbuilder') }</div>
            </div>
          </div>
          <div className={"cards-page-list" + (this.state.hiding.decks ? "" : " restrained-list")}>
            <div className={"cards-page-deck-section" + (this.state.hiding.decks ? " hidden-decks" : "")}>
              <div className="cards-border" onClick={() => { this.setState({hiding: Object.assign({}, this.state.hiding, {decks: !this.state.hiding.decks}), deck: (this.state.hiding.decks ? this.state.deck : null)});}}><div className="cards-border-left">{ read('menu/deckbuilder') }</div><div className="cards-border-right">{this.state.hiding.decks ? "+" : "-"}</div></div>
              <div className="deck-list-carousel">
              <div className="card-list deck-list">
                <div className="listed-deck"><div onClick={() => this.setState({newdeck: true})} className="new-deck"/></div>
                {
                  decks.sort((a, b) => a.deckname > b.deckname ? 1 : -1).map((deck, i) => <div key={i} className={"listed-deck" + (this.state.deck && this.state.deck.key === deck.key ? " selected-deck" : "")} onClick={() => {
                      if (this.state.deck && this.state.deck.key === deck.key)
                        this.setState({deck: null});
                      else {
                        this.setState({deck});
                        let deckname = document.getElementById("deckname-input");
                        if (deckname)
                          deckname.value = deck.deckname;
                      }
                    }
                  }><Deck src={deck}/></div>)
                }
                </div>
              </div>
              {
                this.state.deck ?
                <div className="deckbuilder">
                  <div className="deckbuilder-nav">
                    <div className="deckbuilder-nav-row">
                      <div className="deckbuilder-hero" onClick={() => this.setState({focus:Library.getHero(this.state.deck.body.hero), focusmode: 'deck'})}><Hero src={Library.getHero(this.state.deck.body.hero)} level={3}/></div>
                      <div className="deckbuilder-name"><Input id="deckname-input" type="text" defaultValue={this.state.deck.deckname} onBlur={e => {
                        if (this.state.deck.deckname !== e.target.value) {
                          if (e.target.value.length > 0)
                            SocketManager.master.deckbuild("rename", this.state.deck.key, e.target.value);
                          else e.target.value = this.state.deck.deckname
                        }
                      }}/></div>
                    </div>
                    <div className="deckbuilder-nav-row">
                      <Tooltip target="deckbuilder-count" isOpen={this.state.tooltip === "nonvaliddeck"} toggle={() => this.setState({tooltip: (this.state.tooltip === "nonvaliddeck" || this.state.deck.body.cards.length === 30) ? null : "nonvaliddeck" })}>{ read('menu/nonvaliddeck') }</Tooltip>
                      <div id="deckbuilder-count" className={"deckbuilder-count" + (this.state.deck.body.cards.length === 30 ? " deckbuilder-valid-count" : "")}><div className="deckbuilder-status">{this.state.deck.body.cards.length === 30 ? "✔" : "✘"}</div>{ this.state.deck.body.cards.length + " / 30" }</div>
                      <div className="deckbuilder-buttons">
                        <div className="deckbuilder-back"><MainButton onClick={() => this.setState({deck: null})}>{ read('menu/back') }</MainButton></div>
                        <div className="deckbuilder-delete"><MainButton color="red" onClick={() => this.setState({action: "delete"})}>{ read('menu/delete') }</MainButton></div>
                      </div>
                    </div>
                  </div>
                  <div className="card-list">
                  {
                    sortedDeck.map((card, i) => <div key={i} className="listed-cards" onClick={() => this.setState({focus: card, focusmode: 'deck'})}>{ [...Array(decklist[card.key]).keys()].map(i => <Card key={i} src={card}/>) }</div>)
                  }
                  </div>
                </div>
                : ""
              }
            </div>
            <div className="cards-page-heroesandcards-section">
            {
              this.state.deck ? "" :
              <div className="heroes-section">
                <div id="heroes-border" className="cards-border">
                  <div className="cards-border-left">
                    <div className={"cards-border-change-page pc" + (this.state.page.heroes <= 0 ? " locked" : "") + (pages.heroes <= 0 ? " invisible" : "")} onClick={() => { if (this.state.page.heroes <= 0) return; let newpage = {}; newpage.heroes = this.state.page.heroes - 1; this.setState({page: Object.assign({}, this.state.page, newpage)});}}>&lt;</div>
                      { read('menu/heroes') }
                    <span className="cards-border-cardcount">
                      { "(" + heroes.length + ")" }
                    </span>
                      <span className={"cards-border-page pc" + (pages.heroes <= 0 ? " invisible" : "")}>
                        { (this.state.page.heroes+1) + " / " + pages.heroes }
                      </span>
                  </div>
                  <div className={"cards-border-change-page pc" + (this.state.page.heroes >= pages.heroes - 1 ? " locked" : "") + (pages.heroes <= 0 ? " invisible" : "")} onClick={() => { if (this.state.page.heroes >= pages.heroes - 1) return; let newpage = {}; newpage.heroes = this.state.page.heroes + 1; this.setState({page: Object.assign({}, this.state.page, newpage)});}}>&gt;</div>
                    <div className={"cards-border-right mobile" + (pages.heroes <= 0 ? " invisible" : "")}>
                    <div className={"cards-border-change-page" + (this.state.page.heroes <= 0 ? " locked" : "")} onClick={() => { if (this.state.page.heroes <= 0) return; let newpage = {}; newpage.heroes = this.state.page.heroes - 1; this.setState({page: Object.assign({}, this.state.page, newpage)});}}>&lt;</div>
                      { (this.state.page.heroes+1) + " / " + pages.heroes }
                      <div className={"cards-border-change-page" + (this.state.page.heroes >= pages.heroes - 1 ? " locked" : "")} onClick={() => { if (this.state.page.heroes >= pages.heroes - 1) return; let newpage = {}; newpage.heroes = this.state.page.heroes + 1; this.setState({page: Object.assign({}, this.state.page, newpage)});}}>&gt;</div>
                    </div>
                </div>
                <div className={"card-list " + (this.state.hiding.heroes ? "invisible" : "")}>
                {
                  heroes.map((hero, i) => <div key={i} className="listed-card" onClick={() => this.setState({focus:hero, focusmode: 'collection'})}><Hero src={hero}/></div>)
                }
                </div>
              </div>
            }
              <div className="cards-border"><div className="cards-border-left">{ read('menu/cards') }<span className="cards-border-cardcount">{ "(" + cards.length + ")" }</span></div><div className="cards-border-right"></div></div>
              {
                Object.keys(colors).map(color => colors[color].length > 0 && (!this.state.deck || Library.getHero(this.state.deck.body.hero).colors.includes(color)) ? <div key={color} className="color-list">
                  <div className="color-border">
                    <div className="cards-border-left">
                      <div className={"cards-border-change-page pc" + (this.state.page[color] <= 0 ? " locked" : "")} onClick={() => { if (this.state.page[color] <= 0) return; let newpage = {}; newpage[color] = this.state.page[color] - 1; this.setState({page: Object.assign({}, this.state.page, newpage)});}}>&lt;</div>
                      { read('cards/' + color) }
                      <span className="cards-border-cardcount">
                        { "(" + fullColors[color].length + ")" }
                      </span>
                      <span className="cards-border-page pc">
                        { (this.state.page[color]+1) + " / " + pages[color] }
                      </span>
                    </div>
                    <div className={"cards-border-change-page pc" + (this.state.page[color] >= pages[color] - 1 ? " locked" : "")} onClick={() => { if (this.state.page[color] >= pages[color] - 1) return; let newpage = {}; newpage[color] = this.state.page[color] + 1; this.setState({page: Object.assign({}, this.state.page, newpage)});}}>&gt;</div>
                    <div className="cards-border-right mobile">
                      <div className={"cards-border-change-page" + (this.state.page[color] <= 0 ? " locked" : "")} onClick={() => { if (this.state.page[color] <= 0) return; let newpage = {}; newpage[color] = this.state.page[color] - 1; this.setState({page: Object.assign({}, this.state.page, newpage)});}}>&lt;</div>
                      { (this.state.page[color]+1) + " / " + pages[color] }
                      <div className={"cards-border-change-page" + (this.state.page[color] >= pages[color] - 1 ? " locked" : "")} onClick={() => { if (this.state.page[color] >= pages[color] - 1) return; let newpage = {}; newpage[color] = this.state.page[color] + 1; this.setState({page: Object.assign({}, this.state.page, newpage)});}}>&gt;</div>
                    </div>
                  </div>
                  <div className={"card-list " + (this.state.hiding[color] ? "invisible" : "")}>
                  {
                    colors[color].map((card, i) => <div key={i} className="listed-card" onClick={() => this.setState({focus:card, focusmode: 'collection'})}><Card src={card}/></div>)
                  }
                  </div>
                </div> : "")
              }
            </div>
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

