import React, { Component } from 'react';
//import { Input, Label } from 'reactstrap';
import './Cards.css';
import Nav from '../../nav/Nav';
import Back from '../../Back';
import Card from '../../cards/Card';
import Hero from '../../cards/Hero';
import CardBox from '../../cards/CardBox';
import Library from '../../../scene/utility/Library';

import sorter from '../../cards/CollectionSorter';
import { read } from '../../../TextManager';

export default class Cards extends Component {

  state = {
    focus: null,
    filter: {
      type: "",
      collectable: true,
      orderBy: "type"
    }
  }

  render () {

    let cards = sorter.filter(Object.values(Library.cards), this.state.filter);
    let heroes = sorter.filter(Object.values(Library.heroes), Object.assign({}, this.state.filter, {orderBy: "color"}));

    let colors = {white: [], red: [], blue: [], green: [], black: []};
    Object.keys(colors).forEach(color => colors[color] = cards.filter(c => c.color === color));

    return (
      <div className="main-page cards-page">
      { this.state.focus ? <CardBox src={this.state.focus} open={true} onClose={() => this.setState({focus:null})}/> : "" }
        <Nav/>
        <div className="main">
          <div className="cards-page-nav"></div>
          <div className="cards-page-search"></div>
          <div className="cards-page-list">
            <div className="cards-border"><div className="cards-border-left">{ read('menu/heroes') }</div><div className="cards-border-right"></div></div>
                <div className="card-list">
                {
                  heroes.map((hero, i) => <div key={i} className="listed-card" onClick={() => this.setState({focus:hero})}><Hero src={hero}/></div>)
                }
                </div>
            <div className="cards-border"><div className="cards-border-left">{ read('menu/cards') }</div><div className="cards-border-right"></div></div>
            {
              Object.keys(colors).map(color => colors[color].length > 0 ? <div key={color} className="color-list">
                <div className="color-border">{ read('cards/' + color) }</div>
                <div className="card-list">
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

