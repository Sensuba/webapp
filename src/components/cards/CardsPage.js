import React, { Component } from 'react';
import Card from './Card';
import './CardsPage.css';
import { Input, Label } from 'reactstrap';
import Nav from '../Nav';
import User from '../../services/User';
import Library from '../../services/Library';
import sorter from '../../utility/CollectionSorter';
import Lightbox from '../utility/Lightbox';

export default class CardsPage extends Component {

	constructor (props) {

		super(props);

    this.state = {
      customs: false
    };

    window.search = name => sorter.filter(this.state.customs ? this.props.customs : this.props.cards, {orderBy: "name", search: name});
    window.update = () => Library.clear();
	}

  get filter () {

    var url = new URL(window.location.href);

    var colors = url.searchParams.get("colors");
    colors = colors ? colors.split(",").filter(color => !isNaN(color)).map(color => parseInt(color, 10)) : [];

    return {
      orderBy: url.searchParams.get("orderBy") || "type",
      colors: colors,
      search: url.searchParams.get("search") || "",
      archetype: url.searchParams.get("archetype") || "",
      type: url.searchParams.get("type") || "",
      edition: url.searchParams.get("edition") || ""
    };
  }

  displayCustoms (customs) {

    this.setState({customs: customs});
  }

  filterCards (cards) {

    cards = sorter.filter(cards, this.filter);

    return cards;
  }

  focus (card) {

    this.props.history.push(`/cards${card ? "/focus/" + card : ""}${new URL(window.location.href).search}`);
  }

  search (filter) {

    filter.colors = filter.colors.length > 0 ? filter.colors.reduce((acc, color) => acc + "," + color) : "";

    var suf = "";

    var addFilter = param => {

      if (param === "orderBy" && filter[param] === "type")
        return;
      if (filter[param] !== undefined && filter[param].length !== 0) {
        suf += suf.length === 0 ? "?" : "&";
        suf += param + "=" + filter[param];
      }
    }
    ["search", "archetype", "colors", "edition", "type", "orderBy"].forEach(param => addFilter(param));
    

    this.props.history.push(`/cards${suf}${suf[suf.length-1] === ' ' ? "&" : ""}`);
  }
  
  render() {

    var cards = this.state.customs ? this.props.customs : this.props.cards;
    cards = this.filterCards(cards);
    window.result = cards;

    var editFilter = attr => (e => {
      var plus = {};
      plus[attr] = e.target.value;
      this.search(Object.assign({}, this.filter, plus));
    });

    var colorFilter = color => (e => {
      var colors = this.filter.colors.slice();
      if (e.target.checked)
        colors.push(color);
      else
        colors = colors.filter(c => c !== color);
      this.search(Object.assign(this.filter, {colors: colors}));
    });

    return (
      <div>
        <Lightbox className="sensuba-focus-box" open={this.props.focus !== undefined} onClose={() => this.focus(null)}>
          {
            (() => {

              if (!this.props.focus) return <span/>;

              var cf = [this.props.cards.find(card => card.idCardmodel.toString() === this.props.focus)];

              var addTokens = parent => {
                if (parent.tokens) {
                  parent.tokens.forEach(token => {
                    cf.push(token);
                    addTokens(token);
                  });
                }
              }
              addTokens(cf[0]);

              return <div className="sensuba-card-focus">{ cf.map((card, i) => <Card switch="manual" key={i} src={card}/>) }</div>;
            })()
          }
        </Lightbox>
        <Nav api={this.props.api} history={this.props.history}/>
      	<main>
          {
            User.isConnected() ?
            <div className="card-collection-choicer">
              <div className="vintage-radio">
                <Input id="official-card-collection" type="radio" name="card-collection" onChange={() => this.displayCustoms(false)} defaultChecked/>
                <Label for="official-card-collection">Official</Label>
                <Input id="custom-card-collection" type="radio" name="card-collection" onChange={() => this.displayCustoms(true)}/>
                <Label for="custom-card-collection">Customs</Label>
              </div>
            </div>
            : <span/>
          }
          <div className="sensuba-card-search">
            <div className="third-section">
              <Input id="sensuba-search-text" value={this.filter.search} type="text" placeholder="Search" onChange={editFilter("search").bind(this)}/>
              <Label for="sensuba-search-edition" className="sensuba-search-select-label">Edition</Label>
              <select value={this.filter.edition} id="sensuba-search-edition" onChange={editFilter("edition").bind(this)}>
                <option value="">---</option>
                <option value="1">1st edition</option>
                <option value="2">Next to come</option>
              </select>
              <div>
                { (cards.length > 0 ? <b>{ cards.length }</b> : "No")}{ " card" + (cards.length > 1 ? "s" : "") + " found" }
              </div>
            </div>
            <div className="third-section">
              <Input id="sensuba-search-archetype" value={this.filter.archetype} type="text" placeholder="Archetype" onChange={editFilter("archetype").bind(this)}/>
              <Label for="sensuba-search-type" className="sensuba-search-select-label">Type</Label>
              <select value={this.filter.type} id="sensuba-search-type" onChange={editFilter("type").bind(this)}>
                <option value="">---</option>
                <option value="hero">Hero</option>
                <option value="figure">Figure</option>
                <option value="spell">Spell</option>
                <option value="artifact">Artifact</option>
              </select>
            </div>
            <div className="third-section">
              <div className="colors-group">
                <Input id="neutral-mana" type="checkbox" checked={this.filter.colors.includes(0)} name="sensuba-color" onChange={colorFilter(0)}/>
                <Label for="neutral-mana"/>
                <Input id="white-mana" type="checkbox" checked={this.filter.colors.includes(1)} name="sensuba-color" onChange={colorFilter(1)}/>
                <Label for="white-mana"/>
                <Input id="red-mana" type="checkbox" checked={this.filter.colors.includes(2)} name="sensuba-color" onChange={colorFilter(2)}/>
                <Label for="red-mana"/>
                <Input id="blue-mana" type="checkbox" checked={this.filter.colors.includes(3)} name="sensuba-color" onChange={colorFilter(3)}/>
                <Label for="blue-mana"/>
                <Input id="green-mana" type="checkbox" checked={this.filter.colors.includes(4)} name="sensuba-color" onChange={colorFilter(4)}/>
                <Label for="green-mana"/>
                <Input id="black-mana" type="checkbox" checked={this.filter.colors.includes(5)} name="sensuba-color" onChange={colorFilter(5)}/>
                <Label for="black-mana"/>
              </div>
              <Label for="sensuba-search-orderby" className="sensuba-search-select-label">Order by</Label>
              <select value={this.filter.orderBy} id="sensuba-search-orderby" onChange={editFilter("orderBy").bind(this)}>
                <option value="type">Type</option>
                <option value="mana">Mana</option>
                <option value="atk">ATK</option>
                <option value="hp">HP</option>
                <option value="range">Range</option>
              </select>
            </div>
          </div>
          <div className="sensuba-card-container">
      		  {
              this.state.customs ?
                cards.map(card => <a className="sensuba-card-link" onClick={() => this.props.history.push(`/cards/editor/${card.idCardmodel}`)} key={card.idCardmodel}><Card switch="timer" key={card.idCardmodel} src={card}/></a>)
                :
                cards.map((card, i) => <a className="sensuba-card-link" key={card.idCardmodel} onClick={() => this.focus(card.idCardmodel)}><Card switch="timer" src={card}/></a>)
            }
          </div>
          {
            this.state.customs ?
            <button className="editor-button" onClick={() => this.props.history.push('/cards/editor')}>
              <img className="editor-button-img" src="/editor.png" alt="editor-chan"/>
              <div className="editor-button-text">Open the editor</div>
            </button>
            : <span/>
          }
      	</main>
      </div>
    );
  }
}