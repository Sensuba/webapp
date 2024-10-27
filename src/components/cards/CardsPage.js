import React, { Component } from 'react';
import Card from './Card';
import './CardsPage.css';
import { Input, Label } from 'reactstrap';
import Nav from '../Nav';
import User from '../../services/User';
import Library from '../../services/Library';
import sorter from '../../utility/CollectionSorter';
import Lightbox from '../utility/Lightbox';
import Loader from '../utility/Loader';
//import Booster from './shop/Booster';

const PAGE_SIZE = 50;

export default class CardsPage extends Component {

  constructor (props) {

    super(props);

    this.state = {
      advsearch: false
    };

    this.timers = {};

    window.search = name => sorter.filter(this.cardlist, {orderBy: "name", search: name});
    window.update = () => Library.clear();
  }

  get cardlist () {

    if (!User.isConnected())
      return this.props.cards;

    var url = new URL(window.location.href);
    var mode = url.searchParams.get("mode");
    switch (mode) {
      case "custom": return this.props.customs;
      /*case "collection": {
        let core = this.props.cards.filter(card => card.core)
        return core.concat(this.props.collection.map(el => Object.assign({count: el.number, holographic: el.holographic}, this.props.cards.find(card => card.idCardmodel === el.idCardmodel))).filter(el => !core.find(cc => cc.idCardmodel === el.idCardmodel)));
      }*/
      default: return this.props.cards;
    }
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
      //collection: url.searchParams.get("collection") || ""
    };
  }

  get isCustoms () {

    var url = new URL(window.location.href);
    var mode = url.searchParams.get("mode");
    return mode && mode === "custom";
  }

  changeMode (mode) {

    //var s = new URL(window.location.href).search;
    //this.props.history.push(`/cards${s ? (s + (customs ? "&customs=1") : "") : (customs ? "&customs" : )}`)
    this.search(this.filter, mode);

    //this.setState({customs: customs});
  }

  filterCards (cards) {

    cards = sorter.filter(cards, this.filter);

    return cards;
  }

  focus (card) {

    this.props.history.push(`/cards${card ? "/focus/" + card : ""}${new URL(window.location.href).search}`);
  }

  /*shop (value) {

    this.props.history.push(`/cards${value ? "/shop" : ""}${new URL(window.location.href).search}`);
  }*/

  reload () {

    window.update();
    window.location.reload();
  }

  search (filter, mode, page) {

    filter.colors = filter.colors.length > 0 ? filter.colors.reduce((acc, color) => acc + "," + color) : "";
    filter.mode = mode;
    filter.page = page;

    var display = new URL(window.location.href).searchParams.get("display") || PAGE_SIZE;
    if (display !== PAGE_SIZE)
      filter.display = display;

    var suf = "";

    var addFilter = param => {

      if (param === "orderBy" && filter[param] === "type")
        return;
      if (filter[param] !== undefined && filter[param] !== null && filter[param].length !== 0) {
        suf += suf.length === 0 ? "?" : "&";
        suf += param + "=" + encodeURIComponent(filter[param]);
      }
    }
    ["mode", "search", "archetype", "colors", "edition", "type", "name", "description", "anime", "flavour", "rarity", "mana", "manaop", "atk", "atkop", "hp", "hpop", "range", "rangeop", "orderBy", "page", "display"/*, "collection"*/].forEach(param => addFilter(param));
    /*if (customs) {
        suf += suf.length === 0 ? "?" : "&";
        suf += "customs=1";
    }*/
    

    this.props.history.push(`/cards${suf}${suf[suf.length-1] === ' ' ? "&" : ""}`);
  }

  /*buyBooster (edition) {

    if (this.state.waiting || User.getData().credit < 100)
      return;
    var props = {
      type: "booster",
      edition: edition
    }
    this.setState({waiting: true})
    this.props.api.shop(props, (e) => {
      var opening = e.map(nc => { return {no:nc, recto: false}; });
      this.setState({waiting: false, opening});
      User.updateCredit(User.getData().credit - 100);
    }, () => this.setState({waiting: false}))
  }

  buyCard (id, price) {

    if (this.state.waiting || User.getData().credit < price)
      return;
    var props = {
      type: "buycard",
      cardmodel: id
    }
    this.setState({waiting: true})
    this.props.api.shop(props, (e) => {
      this.setState({waiting: false});
      this.props.updateCollection();
      User.updateCredit(User.getData().credit - price);
    }, () => this.setState({waiting: false}))
  }

  sellCard (id, price) {

    if (this.state.waiting)
      return;
    var props = {
      type: "sellcard",
      cardmodel: id
    }
    this.setState({waiting: true})
    this.props.api.shop(props, (e) => {
      this.setState({waiting: false});
      this.props.updateCollection();
      User.updateCredit(User.getData().credit + price);
    }, () => this.setState({waiting: false}))
  }*/
  
  render() {

    var isCustoms = this.isCustoms;
    var cards = this.cardlist;
    cards = this.filterCards(cards);

    /*if (User.isConnected() && this.props.collection && this.filter.collection) {
      if (this.filter.collection === "true")
        cards = cards.filter(card => card.core || this.props.collection.find(c => card.idCardmodel.toString() === c.idCardmodel.toString()));
      else
        cards = cards.filter(card => !(card.core || this.props.collection.find(c => card.idCardmodel.toString() === c.idCardmodel.toString())));
    }*/
    
    window.result = cards;
    var nocards = cards.length;

    var url = new URL(window.location.href);
    var mode = url.searchParams.get("mode");

    var page = 0;
    var displaysize = url.searchParams.get("display") || PAGE_SIZE;
    if (nocards > displaysize) {
      var fpage = url.searchParams.get("page") || "";
      if (fpage && !isNaN(fpage))
        page = parseInt(fpage, 10);
      cards = cards.slice(displaysize*page, displaysize*(page+1));
    }

    var goPage = p => this.search(this.filter, mode, p);

    var editText = attr => (e => {

      this.timers[attr] = Date.now();
      var val = e.target.value;
      setTimeout(() => {
        if (Date.now() - this.timers[attr] < 790)
          return;
        editFilter(attr)(val);
      }, 800)
    })

    var editFilter = attr => (e => {
      var plus = {};
      plus[attr] = e.target ? e.target.value : e;
      this.search(Object.assign({}, this.filter, plus), mode);
    });

    var colorFilter = color => (e => {
      var colors = this.filter.colors.slice();
      if (e.target.checked)
        colors.push(color);
      else
        colors = colors.filter(c => c !== color);
      this.search(Object.assign(this.filter, {colors: colors}), mode);
    });

    return (
      <div>
        <Lightbox className="sensuba-focus-box" open={this.props.focus !== undefined} onClose={() => this.focus(null)}>
          {
            (() => {

              if (!this.props.focus) return <span/>;

              var cf = [this.props.cards.find(card => card.idCardmodel.toString() === this.props.focus)];

              if (!cf || !cf[0]) return;

              var addTokens = parent => {
                if (parent.tokens) {
                  parent.tokens.forEach(token => {
                    cf.push(token);
                    addTokens(token);
                  });
                }
              }
              addTokens(cf[0]);

              /*var pbuy = 0, psell = 0;
              switch (cf[0].rarity) {
              case 1: pbuy = 25; psell = 4; break;
              case 2: pbuy = 50; psell = 8; break;
              case 3: pbuy = 100; psell = 16; break;
              case 4: pbuy = 200; psell = 20; break;
              default: break;
              }

              var shop = false, shopcount = 0;

              if (User.isConnected() && cf[0].rarity && cf[0].idEdition <= 8) {
                shop = true;
                let shopcollec = this.props.collection.find(card => card.idCardmodel.toString() === this.props.focus);
                if (shopcollec)
                  shopcount = shopcollec.number;
              }*/

              return <div>
                  <div className="sensuba-card-focus">{ cf.map((card, i) => <Card switch="manual" key={i} src={card} holographic={mode === "collection" && cards.find(c => c.idCardmodel.toString() === this.props.focus) && cards.find(c => c.idCardmodel.toString() === this.props.focus).holographic === 1}/>) }</div>
                  { /*shop ? <div className="sensuba-focus-shop">
                    { <div className="sensuba-shop-count">{"x" + shopcount}</div> }
                    { shopcount < 1 || (shopcount < 2 && cf[0].rarity !== 4) ? <div onClick={() => this.buyCard(cf[0].idCardmodel, pbuy)} className="shop-button">Acheter <span className="sensuba-credits">{ pbuy }</span></div> : <span/> }
                    { shopcount ? <div onClick={() => this.sellCard(cf[0].idCardmodel, psell)} className="shop-button">Vendre <span className="sensuba-credits">{ psell }</span></div> : <span/> }
                    { cf[0].core ? <div className="sensuba-shop-count">Core</div> : "" }
                  </div> : <span/> */}
                </div>
            })()
          }
        </Lightbox>
        {/*
          User.isConnected() ?
          <Lightbox className="sensuba-shop-box" open={this.props.shop === true} onClose={() => this.shop(false)}>
            <h2>Améliorez votre collection !</h2>
            <h3>10 cartes / <span className="sensuba-credits">100</span></h3>
            <div className="sensuba-shop-credits">
              <span className="sensuba-credits">{ User.getData().credit }</span>
            </div>
            <div className="sensuba-shop-boosters">
              <div onClick={() => this.buyBooster(2)} className="sensuba-shop-booster"><Booster expansion="Classic" theme="lightblue" img="/game/back.png"/></div>
              <div onClick={() => this.buyBooster(3)} className="sensuba-shop-booster"><Booster expansion="Etoile Gardienne" theme="darksky" img="/guardianstar.jpg"/></div>
              <div onClick={() => this.buyBooster(4)} className="sensuba-shop-booster"><Booster expansion="Grand Bal Masqué" theme="hot" img="/masquerade.jpg"/></div>
              <div onClick={() => this.buyBooster(5)} className="sensuba-shop-booster"><Booster expansion="Croisée des Horizons" theme="aquamarine" img="/lands.png"/></div>
              <div onClick={() => this.buyBooster(6)} className="sensuba-shop-booster"><Booster expansion="Academie Supermagique" theme="purple" img="/magic.jpg"/></div>
              <div onClick={() => this.buyBooster(7)} className="sensuba-shop-booster"><Booster expansion="Nouvelle Destinée" theme="holy" img="/path.png"/></div>
              <div onClick={() => this.buyBooster(8)} className="sensuba-shop-booster"><Booster expansion="Seigneur des Galaxies" theme="space" img="/galaxy.jpg"/></div>
            </div>
          </Lightbox> : <span/>*/
        }
        {/*
          this.state.opening ?
          <div id="opening-cards-container" className="lightbox-container">
            <div className="lightbox-inner">
              <div className="opening-card-list">
                {
                  this.state.opening.map((c, i) => <div onClick={() => {
                    var opening = this.state.opening;
                    if (opening[i].recto)
                      return;
                    opening[i].recto = true;
                    this.setState({opening});
                    if (opening.every(c => c.recto))
                      setTimeout(() => this.props.updateCollection(), 1500);
                  }} key={i} className="sensuba-opening-card"><Card src={c.recto ? this.props.cards.find(off => off.idCardmodel === c.no) : undefined}/></div>)
                }
              </div>
            </div>
          </div> : <span/>*/
        }
        {
          this.state.waiting ?
          <div className="lightbox-container">
            <div className="lightbox-inner">
              <Loader/>
            </div>
          </div> : <span/>
        }
        <Nav api={this.props.api} history={this.props.history}/>
        <main>
          {
            User.isConnected() ?
            <div className="card-collection-choicer">
              <div className="vintage-radio">
                <Input id="official-card-collection" type="radio" name="card-collection" onChange={() => this.changeMode()} defaultChecked={mode === undefined || mode === null} value={mode === undefined || mode === null}/>
                <Label for="official-card-collection">Officiel</Label>
                {/*<Input id="collection-card-collection" type="radio" name="card-collection" onChange={() => this.changeMode("collection")} defaultChecked={mode === "collection"} value={mode === "collection"}/>
                <Label for="collection-card-collection">Collection</Label>*/}
                <Input id="custom-card-collection" type="radio" name="card-collection" onChange={() => this.changeMode("custom")} defaultChecked={mode === "custom"} value={mode === "custom"}/>
                <Label for="custom-card-collection">Personnalisé</Label>
              </div>
            </div>
            : <span/>
          }
          <div className="sensuba-card-search">
            <div className="third-section">
              <Input id="sensuba-search-text" defaultValue={this.filter.search} type="text" placeholder="Recherche" onChange={editText("search").bind(this)}/>
              <Label for="sensuba-search-edition" className="sensuba-search-select-label">Edition</Label>
              <select value={this.filter.edition} id="sensuba-search-edition" onChange={editFilter("edition").bind(this)}>
                <option value="">---</option>
                <option value="2">Classique</option>
                <option value="3">Etoile Gardienne</option>
                <option value="4">Grand Bal Masqué</option>
                <option value="5">Croisée des Horizons</option>
                <option value="6">Académie Supermagique</option>
                <option value="7">Nouvelle Destinée</option>
                <option value="8">Seigneur des Galaxies</option>
                <option value="9">Fable Infinie</option>
                { User.isConnected() && User.getData().authorization >= 4 ? <option value="10">A venir</option> : "" }
              </select>
              <div>
                { (nocards > 0 ? <b>{ nocards }</b> : "Aucune")}{ " carte" + (nocards > 1 ? "s" : "") + " trouvée" + (nocards > 1 ? "s" : "") }
              </div>
            </div>
            <div className="third-section">
              <Label for="sensuba-search-type" className="sensuba-search-select-label">Type</Label>
              <select value={this.filter.type} id="sensuba-search-type" onChange={editFilter("type").bind(this)}>
                <option value="">---</option>
                <option value="hero">Héros</option>
                <option value="figure">Figure</option>
                <option value="spell">Sort</option>
                <option value="secret">Secret</option>
                <option value="artifact">Artéfact</option>
              </select>
              <Label for="sensuba-search-rarity" className="sensuba-search-select-label">Rareté</Label>
              <select value={this.filter.rarity} id="sensuba-search-rarity" onChange={editFilter("rarity").bind(this)}>
                <option value="">---</option>
                <option value="common">Commune</option>
                <option value="uncommon">Insolite</option>
                <option value="rare">Rare</option>
              </select>
              <div className="sensuba-search-page">
               {
                nocards > displaysize ?
                <div>
                  <div className={"sensuba-search-page-button-wrapper" + (page > 0 ? "" : " sensuba-search-page-locked-button")} onClick={page > 0 ? () => goPage(page-1) : () => {}}><span className="sensuba-search-page-button">&#11164;</span></div>
                  <span className="sensuba-search-page-text">{ (page + 1) + " / " + (Math.floor((nocards-1) / displaysize + 1)) }</span>
                  <div className={"sensuba-search-page-button-wrapper" + (page < Math.floor((nocards-1) / displaysize) ? "" : " sensuba-search-page-locked-button")} onClick={page < Math.floor((nocards-1) / displaysize) ? () => goPage(page+1) : () => {}}><span className="sensuba-search-page-button">&#11166;</span></div>
                </div>
                : <span/>
               }
              </div>
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
                {/*
                  User.isConnected() ?
                  <div>
                  <Input id="collection-check" type="checkbox" className={this.filter.collection} name="sensuba-color" onChange={e => this.search(Object.assign(this.filter, {collection: this.filter.collection ? (this.filter.collection === "true" ? "false" : undefined) : "true"}), mode)}/>
                  <Label for="collection-check"/>
                  </div> : <span/>
                */}
                
              </div>
              <Label for="sensuba-search-orderby" className="sensuba-search-select-label">Trier par</Label>
              <select value={this.filter.orderBy} id="sensuba-search-orderby" onChange={editFilter("orderBy").bind(this)}>
                <option value="type">Type</option>
                <option value="name">Nom</option>
                <option value="mana">Mana</option>
                <option value="atk">ATK</option>
                <option value="hp">PV</option>
                <option value="range">Portée</option>
                <option value="color">Couleur</option>
                <option value="rarity">Rareté</option>
                <option value="edition">Edition</option>
                <option value="anime">Anime</option>
              </select>
              <div className="sensuba-search-interact" onClick={e => this.setState({advsearch: !this.state.advsearch})}>Plus d'options &#10148;</div>
            </div>
          </div>
          {
            this.state.advsearch ?
            <div className="sensuba-card-search">
              <div className="third-section">
                <Input id="sensuba-search-name" defaultValue={this.filter.name} type="text" placeholder="Nom" onChange={editText("name").bind(this)}/>
                <Input id="sensuba-search-description" defaultValue={this.filter.description} type="text" placeholder="Description" onChange={editText("description").bind(this)}/>
                <Input id="sensuba-search-archetype" defaultValue={this.filter.archetype} type="text" placeholder="Archétype" onChange={editText("archetype").bind(this)}/>
                <Input id="sensuba-search-anime" defaultValue={this.filter.anime} type="text" placeholder="Anime" onChange={editText("anime").bind(this)}/>
              </div>
              <div className="two-thirds-section">
                <div className="third-section">
                  <div className="sensuba-search-label-section"><div className="sensuba-search-select-label">Mana</div></div>
                  <div className="sensuba-search-label-section"><div className="sensuba-search-select-label">ATK</div></div>
                  <div className="sensuba-search-label-section"><div className="sensuba-search-select-label">PV</div></div>
                  <div className="sensuba-search-label-section"><div className="sensuba-search-select-label">Portée</div></div>
                </div>
                <div className="third-section">
                  <select value={this.filter.manaop} id="sensuba-search-mana-op" onChange={editFilter("manaop").bind(this)}>
                    <option value=""></option>
                    <option value="1">&gt;</option>
                    <option value="2">&ge;</option>
                    <option value="3">&#61;</option>
                    <option value="4">&ne;</option>
                    <option value="5">&le;</option>
                    <option value="6">&lt;</option>
                  </select>
                  <select value={this.filter.atkop} id="sensuba-search-atk-op" onChange={editFilter("atkop").bind(this)}>
                    <option value=""></option>
                    <option value="1">&gt;</option>
                    <option value="2">&ge;</option>
                    <option value="3">&#61;</option>
                    <option value="4">&ne;</option>
                    <option value="5">&le;</option>
                    <option value="6">&lt;</option>
                  </select>
                  <select value={this.filter.hpop} id="sensuba-search-hp-op" onChange={editFilter("hpop").bind(this)}>
                    <option value=""></option>
                    <option value="1">&gt;</option>
                    <option value="2">&ge;</option>
                    <option value="3">&#61;</option>
                    <option value="4">&ne;</option>
                    <option value="5">&le;</option>
                    <option value="6">&lt;</option>
                  </select>
                  <select value={this.filter.rangeop} id="sensuba-search-range-op" onChange={editFilter("rangeop").bind(this)}>
                    <option value=""></option>
                    <option value="1">&gt;</option>
                    <option value="2">&ge;</option>
                    <option value="3">&#61;</option>
                    <option value="4">&ne;</option>
                    <option value="5">&le;</option>
                    <option value="6">&lt;</option>
                  </select>
                </div>
                <div className="third-section">
                  <Input id="sensuba-search-mana" defaultValue={this.filter.mana} type="text" onChange={editText("mana").bind(this)}/>
                  <Input id="sensuba-search-atk" defaultValue={this.filter.atk} type="text" onChange={editText("atk").bind(this)}/>
                  <Input id="sensuba-search-hp" defaultValue={this.filter.hp} type="text" onChange={editText("hp").bind(this)}/>
                  <Input id="sensuba-search-range" defaultValue={this.filter.range} type="text" onChange={editText("range").bind(this)}/>
                </div>
              </div>
            </div>
            : <span/>
          }
          <div className="sensuba-card-container">
            {
              isCustoms ?
                cards.map(card => <a className="sensuba-card-link" onClick={() => this.props.history.push(`/cards/editor/${card.idCardmodel}`)} key={card.idCardmodel}><Card switch="timer" key={card.idCardmodel} src={card} holographic={false}/></a>)
                :
                cards.map((card, i) => <a className="sensuba-card-link" key={card.idCardmodel} onClick={() => this.focus(card.idCardmodel)}>
                  <Card switch="timer" src={card} holographic={card.holographic === 1}/>
                  {/* mode === "collection" && !(card.count === undefined && card.cardType === "hero") && card.count !== 1 ? <div className="sensuba-card-count">{card.count ? "x" + card.count : "★"}</div> : <span/> */}
                  </a>)
            }
          </div>
          <div className="sensuba-search-page sensuba-search-page-bottom">
           {
            nocards > displaysize ?
            <div>
              <div className={"sensuba-search-page-button-wrapper" + (page > 0 ? "" : " sensuba-search-page-locked-button")} onClick={page > 0 ? () => goPage(page-1) : () => {}}><span className="sensuba-search-page-button">&#11164;</span></div>
              <span className="sensuba-search-page-text">{ (page + 1) + " / " + (Math.floor((nocards-1) / displaysize + 1)) }</span>
              <div className={"sensuba-search-page-button-wrapper" + (page < Math.floor((nocards-1) / displaysize) ? "" : " sensuba-search-page-locked-button")} onClick={page < Math.floor((nocards-1) / displaysize) ? () => goPage(page+1) : () => {}}><span className="sensuba-search-page-button">&#11166;</span></div>
            </div>
            : <span/>
           }
          </div>
          {/*
            mode === "collection" || (!mode && User.isConnected()) ?
            <button className="editor-button" onClick={() => this.shop(true)}>
              <img className="editor-button-img" src="/shop.png" alt="shop-chan"/>
              <div className="editor-button-text">Acheter des cartes</div>
            </button>
            : <span/>
          */}
          {
            isCustoms ?
            <button className="editor-button" onClick={() => this.props.history.push('/cards/editor')}>
              <img className="editor-button-img" src="/editor.png" alt="editor-chan"/>
              <div className="editor-button-text">Ouvrir l'éditeur</div>
            </button>
            : <span/>
          }
          <div className="bottom-info"><span onClick={() => this.reload()}>Recharger les cartes</span></div>
        </main>
      </div>
    );
  }
}