import React, { Component } from 'react';
import Nav from '../../Nav';
import { Input, Label } from 'reactstrap';
import Design from './EditorDesign';
import Blueprint from './Blueprint/EditorBlueprint';
import Animation from './Animation/EditorAnimation';
import User from '../../../services/User';
import './EditorPage.css';

export default class EditorPage extends Component {

  defaultCard = {
      nameCard: "Pingouin",
      anime: "Anime",
      imgLink: "https://image.ibb.co/jbcTNJ/penguin.png",
      idColor: 0,
      cardType: "figure",
      archetypes: [],
      mana: 0,
      description: "",
      fontSize: 1.3,
      flavourText: "",
      illustrator: "",
      atk: 200,
      hp: 200,
      range: 1,
      overload: 0
  };

	constructor (props) {

		super(props);
      
    var card = this.props.card || Object.assign({}, this.defaultCard);

    var auth = User.getData();
    if (auth)
      auth = auth.authorization;

    this.state = { card, token: [], tab: "design", authorization: auth };
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
	}

  get currentCard() {

    var cc = this.state.card;
    this.state.token.forEach(el => cc = cc.tokens[el]);
    return cc;
  }

  set currentCard(value) {

    if (this.state.token.length === 0) {
      this.setState({card: value});
      return;
    }
    var cc = this.state.card;
    this.state.token.slice(0,-1).forEach(el => cc = cc.tokens[el]);
    cc.tokens[this.state.token[this.state.token.length-1]] = value;
    this.setState({card: this.state.card});
  }

  newToken() {
      
    var token = Object.assign({}, this.defaultCard);

    this.currentCard.tokens = this.currentCard.tokens || [];
    this.currentCard.tokens.push(token);

    var c = this.state.token;
    c.push(this.currentCard.tokens.length-1);

    this.setState({card: this.state.card, token: c});
  }

  saveCard() {

    if (this.saved)
      return;

    var shadow = this.state.card;
    delete shadow.htmlDescription;
    if (shadow.cardType === "hero") {
      if (shadow.lv2)
        delete shadow.lv2.htmlDescription;
      if (shadow.lvmax)
        delete shadow.lvmax.htmlDescription;
    }
    if (shadow.supercode)
      delete shadow.supercode;

    var supercode = window.btoa(JSON.stringify(shadow));

    var params = { supercode };

    if (this.props.card !== undefined)
      params.id = this.props.card.idCardmodel;

    this.props.api.saveCustomCards(params, () => {

      var pd = localStorage.getItem("playdeck");
      if (this.props.card && this.props.card.idCardmodel && pd) {
        pd = JSON.parse(pd);
        var idcard = this.props.card.idCardmodel;
        if (pd.hero.toString() === idcard.toString()) {
          pd.hero = shadow;
          pd.hero.supercode = supercode;
        }
        for (var i = 0; i < pd.body.length; i++) {
          if (pd.body[i] && pd.body[i].toString() === idcard.toString()) {
            pd.body[i] = shadow;
            pd.body[i].supercode = supercode;
          }
        }
        localStorage.setItem("playdeck", JSON.stringify(pd));
      }
      delete this.saved;
      this.props.history.push('/cards?mode=custom');
      this.props.updateCustoms();
    })

    this.saved = true;

  }

  deleteCard() {

    if (this.state.token.length > 0) {

      var t = this.state.token[this.state.token.length-1];
      this.setState({token: this.state.token.slice(0,-1)}, () => {
        var cc = Object.assign({}, this.currentCard);
        cc.tokens = this.currentCard.tokens.filter((el, i) => i !== t);
        this.currentCard = cc;
      });
    } else {

      this.props.api.deleteCustomCards(this.props.card.idCardmodel, () => {

        this.props.history.push('/cards?mode=custom');
        this.props.updateCustoms();
      })
    }
  }

  changeType(newType) {

    var filter = [];
    var basis = {
        archetypes: [],
        mana: 0,
        atk: 200,
        hp: 200,
        range: 1
    };
    switch (newType) {
    case "figure": filter = ["idColor2"]; break;
    case "hero": filter = ["archetypes", "mana"]; break;
    case "spell": filter = ["idColor2", "archetypes", "atk", "hp", "range"]; break;
    case "trap": filter = ["idColor2", "archetypes", "atk", "hp", "range"]; break;
    case "seal": filter = ["idColor2", "archetypes", "atk", "hp", "range", "mana"]; break;
    case "artifact": filter = ["idColor2", "archetypes", "atk", "range"]; break;
    default: break;
    }

    var n = Object.assign({}, basis, this.currentCard, {cardType: newType});
    filter.forEach(f => delete n[f]);
    if (newType === "hero")
      n.idColor2 = 0;
    
    this.currentCard = n;
  }
  
  render() {

    /*var editAttribute = attr => (e => {
      var plus = {};
      this.currentCard[attr] = e.target.value;
      if (typeof plus[attr] === 'string') plus[attr].replace(/[\u0250-\ue007]/g, '');
      this.setState({card: this.state.card});
    });

    var changeArchetypes = (ar1, ar2) => {
      var ars = [];
      if (ar1 && ar1 !== "")
        ars.push(ar1.toLowerCase());
      if (ar2 && ar2 !== "")
        ars.push(ar2.toLowerCase());
      this.currentCard.archetypes = ars;
      this.setState({card: this.state.card});
    };

    var changeColor = idColor => () => {
      this.currentCard.idColor = idColor;
      this.setState({card: this.state.card});
    };

    var changeColor2 = idColor => () => {
      this.currentCard.idColor2 = idColor;
      this.setState({card: this.state.card});
    };*/

    var shadow = this.currentCard;
    delete shadow.htmlDescription;
    if (shadow.cardType === "hero") {
      if (shadow.lv2)
        delete shadow.lv2.htmlDescription;
      if (shadow.lvmax)
        delete shadow.lvmax.htmlDescription;
    }
    if (shadow.cardType === "artifact" && shadow.mecha) {
      if (shadow.mechactive)
        delete shadow.mechactive.htmlDescription;
    }
    if (shadow.supercode)
      delete shadow.supercode;

    var design =
    <Design
      authorization={this.state.authorization}
      ref="design"
      idmodel={this.props.idmodel}
      card={this.state.card}
      token={this.state.token}
      update={card => this.setState({card})}
      defaultCard={this.defaultCard}
      save={() => this.saveCard()}
      delete={() => this.deleteCard()}
      isEdit={this.props.card !== undefined}
      setToken={token => this.setState({token})}
      className={this.state.tab === "design" ? "" : "invisible"}
    />;

    var blueprint =
    <Blueprint
      key={JSON.stringify(this.state.token)}
      save={(bp, schematics) => {
        if (this.currentCard.cardType === "hero") {
          switch (this.refs.design.state.level) {
          case 1: this.currentCard.blueprint = bp; break;
          case 2: this.currentCard.lv2.blueprint = bp; break;
          case 3: this.currentCard.lvmax.blueprint = bp; break;
          default: break;
          }
        } else if (this.currentCard.cardType === "artifact" && this.currentCard.mecha && this.refs.design.state.level === 2)
          this.currentCard.mechactive.blueprint = bp;
        else 
          this.currentCard.blueprint = bp;
        this.setState({card: this.state.card, tab: "design"});
      }}
      className={this.state.tab === "blueprint" ? "" : "invisible"}
    />

    var animation =
    <Animation
      card={this.state.card}
      update={anim => this.setState({card: Object.assign(this.state.card, {animations: anim})})}
      className={this.state.tab === "animation" ? "" : "invisible"} model={this.state.card}
    />

    //var superCode = window.btoa(JSON.stringify(shadow));

    return (
      <div>
        <Nav api={this.props.api} history={this.props.history}/>
      	<main id="editor-page">
          <div className="editor-menu">
            <div className="editor-menu-tabs">
              <Input id="design-tab" type="radio" onChange={() => this.setState({tab: "design"})} checked={this.state.tab === "design"}/>
              <Label for="design-tab">Design</Label>
              <Input id="blueprint-tab" type="radio" onChange={() => this.setState({tab: "blueprint"})} checked={this.state.tab === "blueprint"}/>
              <Label for="blueprint-tab">Blueprint</Label>
              { /* <Input id="animation-tab" type="radio" onChange={() => this.setState({tab: "animation"})} checked={this.state.tab === "animation"}/>
              <Label for="animation-tab">Animation</Label> */ }
            </div>
            { design }
            { blueprint }
            { animation }
          </div>
      	</main>
      </div>
    );
  }
}