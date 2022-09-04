import React, { Component } from 'react';
import Deck from '../Deck.js';
import { Input, Label } from 'reactstrap';
import Card from '../../cards/Card';
import sorter from '../../../utility/CollectionSorter';
//import { Progress } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import User from '../../../services/User';
import Assistant from './AssistantBuilder';

export default class Deckbuilder extends Component {

	constructor (props) {

		super(props);

    var choices;
    if (this.draft) {
      this.draftColorList = this.getColorList();
      choices = this.generateDraftChoice(this.draftColorList.cards);
    }

    this.assistant = new Assistant(this.props.cards);
		this.state = { filter: "", preview: null, draft: this.draft, suggestions: this.assistant.suggest(this.getColorList(), this.props.deck, 3), choices };
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
	}

  get draft () {

    return this.props.type === "draft";
  }

  get filter () {

    var url = new URL(window.location.href);

    var colors = url.searchParams.get("colors");
    colors = colors ? colors.split(",").filter(color => !isNaN(color)).map(color => parseInt(color, 10)) : [];

    return {
      mode: url.searchParams.get("mode") || "",
      orderBy: url.searchParams.get("orderBy") || "type",
      colors: colors,
      search: url.searchParams.get("search") || "",
      archetype: url.searchParams.get("archetype") || "",
      type: url.searchParams.get("type") || "",
      edition: url.searchParams.get("edition") || "",
      name: url.searchParams.get("name") || "",
      description: url.searchParams.get("description") || "",
      anime: url.searchParams.get("anime") || "",
      flavour: url.searchParams.get("flavour") || "",
      rarity: url.searchParams.get("rarity") || "",
      mana: url.searchParams.get("mana") || "",
      manaop: url.searchParams.get("manaop") || "",
      atk: url.searchParams.get("atk") || "",
      atkop: url.searchParams.get("atkop") || "",
      hp: url.searchParams.get("hp") || "",
      hpop: url.searchParams.get("hpop") || "",
      range: url.searchParams.get("range") || "",
      rangeop: url.searchParams.get("rangeop") || "",
      collection: url.searchParams.get("collection") || ""
    };
  }

  generateDraftChoice (cards) {

    var pickRandomCard = list => list[Math.floor(Math.random()*list.length)];

      var draftlist = [];
      for (let i = 0; i < 3;) {
        let draftnew = pickRandomCard(cards);

        if (draftlist.some(card => card === draftnew))
          continue;
        if (draftnew.idColor === 0 && Math.random() < 0.5)
          continue;
        if (this.props.deck.cards[draftnew.idCardmodel] && this.props.deck.cards[draftnew.idCardmodel] >= Math.min(2, draftnew.count || 2))
          continue;
        draftlist.push(draftnew);
        i++;
      }
      return draftlist;
  }

	get count () {

		return Object.values(this.props.deck.cards).reduce((acc, val) => acc + val, 0)
	}

  addCard (id) {

  	if (this.count >= (this.props.deck.format === "highlander" ? 60 : 30))
  		return;
  	var c = this.props.deck.cards;
  	c[id] = Math.min((this.props.deck.format === "highlander" ? 1 : 2), (c[id] || 0) + 1);
    var cc = this.props.cards.find(card => card.idCardmodel === id);
    if (cc && cc.count === 1)
      this.hideTooltip();
  	this.props.updateDeck();

    this.setState({ suggestions: this.assistant.suggest(this.getColorList(), this.props.deck, 3) });
  }

  addDraftCard (id) {

    var end = this.count >= 29;
    var c = this.props.deck.cards;
    c[id] = (c[id] || 0) + 1;
    this.props.updateDeck();
    this.setState({choices: this.generateDraftChoice(this.draftColorList.cards), draft: !end});
  }

  removeCard(id) {

  	var c = this.props.deck.cards;
  	c[id] = Math.max(0, (c[id] || 0) - 1);
  	if (c[id] === 0)
  		delete c[id];
  	this.props.updateDeck();

    this.setState({ suggestions: this.assistant.suggest(this.getColorList(), this.props.deck, 3) });
  }

  showTooltip(e, card, left, bottom) {

  	var tooltip = document.getElementById("img-preview-tooltip");
    if (e) {
      if (e.pageX < 400)
        left = false;
      tooltip.setAttribute("style", `display: block; top: ${e.pageY > window.innerHeight * 0.74 - 60 + window.scrollY ? window.innerHeight * 0.74 - 60 + window.scrollY : (e.pageY < 140 + window.innerHeight * 0.2 ? 140 + window.innerHeight * 0.2 : e.pageY)}px; left: ${e.pageX}px; margin-left: ${left ? -18 : 4}em`);
    }
    else tooltip.setAttribute("style", `display: block`);
    this.setState({preview: card});
  }

  hideTooltip() {

  	var tooltip = document.getElementById("img-preview-tooltip");
  	tooltip.setAttribute("style", `display: none`);
  }

  saveDeck() {

    if (this.state.saved)
      return;

    /*var currentDeck = User.getDeck();
    if (currentDeck) {
      currentDeck = JSON.parse(currentDeck);

      if (currentDeck.id === this.state.deck.idDeck) {*/

        var deck = this.props.deck;
        var res = { id: deck.idDeck, hero: deck.hero, body: [], format: deck.format };
        var cc = this.props.cards.find(el => el.idCardmodel === parseInt(deck.hero, 10));
        if (cc && !cc.idEdition)
          res.hero = cc;
        Object.keys(deck.cards).forEach(c => {
          for (let i = 0; i < deck.cards[c]; i++) {
            var cc = this.props.cards.find(el => el.idCardmodel === parseInt(c, 10));
            if (cc) {
              if (cc.idEdition)
                res.body.push(parseInt(c, 10));
              else
                res.body.push(cc);
            }
          }
        })
        if (deck.format !== "display" && Object.values(deck.cards).reduce((a, b) => a + b, 0) === (deck.format === "highlander" ? 60 : 30))
          User.updateDeck(res);
    //  }
    //}
    
    var copycode = Object.assign({}, this.props.deck);
    delete copycode.idDeck;
    var supercode = window.btoa(JSON.stringify(copycode).replace(/"[^\x00-\x7Fàéçâîôêûöïüëäè]"/g, ""));

    var params = { supercode };

    if (!this.state.new)
      params.id = this.props.deck.idDeck;

    this.props.onSave(params);

    this.setState({saved: true});
  }

  deleteDeck() {

    if (this.state.saved)
      return;

    var currentDeck = User.getDeck();
    if (currentDeck) {
      currentDeck = JSON.parse(currentDeck);
      if (currentDeck.id === this.props.deck.idDeck)
        User.updateDeck(null);
    }

    this.props.onDelete(this.props.deck.idDeck);

    this.setState({saved: true});
  }

  getColorList () {

    var clist = {};
    clist.hero = this.props.cards.find(c => c.idCardmodel === (this.props.deck.hero.idCardmodel || this.props.deck.hero));
    clist.cards = this.props.cards.filter(c => c && c.cardType !== "hero" && (c.idColor === 0 || (clist.hero && c.idColor === clist.hero.idColor) || (clist.hero && c.idColor === clist.hero.idColor2)) && !(c.count === 1 && this.props.type !== "display" && this.props.deck.cards[c.idCardmodel]));
    sorter.sort(clist.cards, "name");
    return clist;
  }

	render () {

    var clist = this.getColorList();

		var hero = clist.hero;
		var cards = clist.cards;

		var listCards = Object.keys(this.props.deck.cards).map(g => this.props.cards.find(c => c.idCardmodel && c.idCardmodel.toString() === g)).filter(c => c !== undefined);
		sorter.sort(listCards, "type");

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

      var copycode = Object.assign({}, this.props.deck);
      delete copycode.idDeck;
      delete copycode.author;
      delete copycode.list;
      delete copycode.supercode;
      var superCode = window.btoa(JSON.stringify(copycode).replace(/"[^\x00-\x7Fàéçâîôêûöïüëäè]"/g, ""));

    	//var nbFigures = listCards.filter(c => c.cardType === "figure").map(c => this.props.deck.cards[c.idCardmodel]).reduce((acc, val) => acc + val, 0);
    	//var nbSpells = listCards.filter(c => c.cardType === "spell").map(c => this.props.deck.cards[c.idCardmodel]).reduce((acc, val) => acc + val, 0);

    	var chartFilter = (type, mana, plus = false) => listCards.filter(c => c.cardType === type && (plus ? c.mana >= mana : c.mana === mana.toString())).map(c => this.props.deck.cards[c.idCardmodel]).reduce((acc, val) => acc + val, 0);

    	var chart = [
    		{name: "0", figures: chartFilter("figure", 0), sorts: chartFilter("spell", 0), secrets: chartFilter("secret", 0), artefacts: chartFilter("artifact", 0)},
    		{name: "1", figures: chartFilter("figure", 1), sorts: chartFilter("spell", 1), secrets: chartFilter("secret", 1), artefacts: chartFilter("artifact", 1)},
    		{name: "2", figures: chartFilter("figure", 2), sorts: chartFilter("spell", 2), secrets: chartFilter("secret", 2), artefacts: chartFilter("artifact", 2)},
    		{name: "3", figures: chartFilter("figure", 3), sorts: chartFilter("spell", 3), secrets: chartFilter("secret", 3), artefacts: chartFilter("artifact", 3)},
    		{name: "4", figures: chartFilter("figure", 4), sorts: chartFilter("spell", 4), secrets: chartFilter("secret", 4), artefacts: chartFilter("artifact", 4)},
    		{name: "5", figures: chartFilter("figure", 5), sorts: chartFilter("spell", 5), secrets: chartFilter("secret", 5), artefacts: chartFilter("artifact", 5)},
    		{name: "6+", figures: chartFilter("figure", 6, true), sorts: chartFilter("spell", 6, true), secrets: chartFilter("secret", 6, true), artefacts: chartFilter("artifact", 6, true)}
    	];

		return (
		<div>
			<div id="img-preview-tooltip" data-toggle="tooltip" data-placement="right" src="" alt="preview" data-animation="false" data-trigger="manual">
				{ this.state.preview ? <Card src={this.state.preview}/> : <span/> }
			</div>
        {
          this.state.draft ?
          <div>
          <h1 className="big-text">Choisissez une carte</h1>
            <div className="hero-selector">
              <div className="hero-list">
              {
                this.state.choices.map((h, i) => <div key={i} className="select-hero-card main-hero-card" onClick={() => {
                  this.addDraftCard(h.idCardmodel);
                }}><Card src={h}/></div>)
              }
              </div>
            </div>
          </div>
          :
          <div>
        		<div className="half-section deck-image-preview">
        			<Deck src={{name: this.props.deck.name, background: this.props.deck.background, idColor: hero ? hero.idColor : 0, idColor2: hero ? hero.idColor : 0, format: this.props.deck.format }}/>
        			<button className="menu-button" onClick={this.saveDeck.bind(this)}>{ !this.props.new ? "Modifier" : "Enregistrer" }</button>
              { !this.props.new ? <button className="red menu-button" onClick={this.deleteDeck.bind(this)}>Supprimer</button> : <span/> }
        		</div>
        		<div className="half-section">
        			<div className="editor-box">
        				<Label for="deck-name-form">Nom du deck</Label>
        				<Input type="text" id="deck-name-form" value={this.props.deck.name} onChange={e => { var d = Object.assign(this.props.deck, {name: e.target.value}); this.setState({deck: d}); }}/>
        				<Label for="deck-background-form">Lien de l'image</Label>
                <Input type="text" id="deck-background-form" value={this.props.deck.background} onChange={e => { var d = Object.assign(this.props.deck, {background: e.target.value}); this.setState({deck: d}); }}/>
                <Label for="deck-format-form">Format</Label>
                <Input type="select" id="deck-format-form" value={this.props.deck.format} onChange={e => this.props.updateFormat(e.target.value)}>
                  <option value="standard">Standard</option>
                  <option value="highlander">Highlander</option>
                  <option value="custom">Personnalisé</option>
                  {/*<option value="display">Vitrine</option>*/}
                </Input>
                <Label for="deck-supercode-form">Supercode</Label>
  	                <Input id="deck-supercode-form" type="textarea" rows="4" value={superCode} onChange={ e => {
  	                    try {
  	                        var d = JSON.parse(window.atob(e.target.value));
  	                        this.props.updateDeck(d, true);
  	                    } catch (e) { }
  	                } }/>
        			</div>
        		</div>
          </div>
        }
      		<div className="sensuba-deckbuilder">
      			<div className="sensuba-deckbuilder-list">
      				<div className="sensuba-deckbuilder-list-cards">
      					{
      						listCards.map((model, i) => {

      							var arr = [];
      							var j = 0;
      							while (j++ < this.props.deck.cards[model.idCardmodel])
      								arr.push(j);

      							return <div key={i} className="sensuba-deckbuilder-list-group" onMouseMove={e => this.showTooltip(e, model, i >= 3)} onMouseLeave={e => this.hideTooltip()} onClick={this.state.draft ? () => {} : () => this.removeCard(model.idCardmodel)}>{arr.map(i => <Card className={this.props.isGhost(model, i) ? "sensuba-deckbuilder-ghost-card" : ""} key={i} src={model}/>)}</div>;
      						})
      					}
      				</div>
      				<div className="sensuba-deckbuilder-list-count">{this.count}</div>
      			</div>
            {
            this.state.draft ?
            <span/>
            :
      			<div className="sensuba-deckbuilder-search">
      				<Input type="text" placeholder="Recherche" className="sensuba-deckbuilder-search-input" value={this.state.filter} onChange={e => this.setState({filter: e.target.value})}/>
      				<div className="sensuba-deckbuilder-search-list">
      				{
      					cards.filter(c => c.nameCard.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(this.state.filter.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))).map((c, i) =>
      						<div key={i} className={"sensuba-deckbuilder-tag " + colorIdToClassName(c.idColor)} onMouseMove={e => this.showTooltip(e, c, true)} onMouseLeave={e => this.hideTooltip()} onClick={() => this.addCard(c.idCardmodel)}>
      							<div className="sensuba-deckbuilder-tag-name">{c.nameCard}</div>
      							<img className="sensuba-deckbuilder-tag-img" src={c.imgLink} alt={c.nameCard}/>
      						</div>)
      				}
      				</div>
              { /* <div className="sensuba-deckbuilder-suggestions-header">Suggestions</div>
              <div className="sensuba-deckbuilder-suggestions">
              {
                this.state.suggestions.filter(c => c).map((c, i) =>
                  <div key={i} className={"sensuba-deckbuilder-tag " + colorIdToClassName(c.idColor)} onMouseMove={e => this.showTooltip(e, c, true)} onMouseLeave={e => this.hideTooltip()} onClick={() => this.addCard(c.idCardmodel)}>
                    <div className="sensuba-deckbuilder-tag-name">{c.nameCard}</div>
                    <img className="sensuba-deckbuilder-tag-img" src={c.imgLink} alt={c.nameCard}/>
                  </div>)
              }
              </div> */ }
      			</div>
            }
      		</div>
      		<div>
      			<div className="half-section">
      			<div className="half-section deckbuilder-hero-preview">
      				<Card className={this.props.isGhost(hero) ? "sensuba-deckbuilder-ghost-card" : ""} switch="manual" src={hero}/>
      			</div>
      			<div className="half-section deckbuilder-type-repartition">
      				{ /* <Progress className="figures empty" type="circle" percent={nbFigures * 100 / this.count} format={percent => `${nbFigures} figure${nbFigures > 1 ? "s" : ""}`}/>
      				<Progress className="spells empty" type="circle" percent={nbSpells * 100 / this.count} format={percent => `${nbSpells} sort${nbSpells > 1 ? "s" : ""}`}/>
      			*/ }</div>
      			</div>
      			<div className="half-section deckbuilder-cost-repartition">
      				<BarChart width={500} height={250} data={chart}>
			       <CartesianGrid strokeDasharray="3 3"/>
			       <XAxis dataKey="name"/>
			       <YAxis/>
			       <Tooltip/>
			       <Legend />
			       <Bar dataKey="figures" stackId="a" fill="#FF6000" />
             <Bar dataKey="sorts" stackId="a" fill="rgb(16, 142, 233)" />
             <Bar dataKey="secrets" stackId="a" fill="rgb(141, 17, 199)" />
			       <Bar dataKey="artefacts" stackId="a" fill="#20caFF" />
			      </BarChart>
      			</div>
      		</div>
	    </div>
		)
	}
}