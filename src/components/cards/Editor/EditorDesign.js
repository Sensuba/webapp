import React, { Component } from 'react';
import Card from '../Card';
//import User from '../../../services/User';
import { Form, Input, FormGroup, Label } from 'reactstrap';

const IMGBB_API_KEY = "b4f9e0c243faf713fe8af060a29a9d8f";

export default class EditorPage extends Component {

  state = { level: 1 }

  get currentCard() {

    var cc = this.props.card;console.log(cc)
    this.props.token.forEach(el => cc = cc.tokens[el]);
    return cc;
  }

  set currentCard(value) {

    if (this.props.token.length === 0) {
      this.props.update(value);
      return;
    }
    var cc = this.props.card;
    this.props.token.slice(0,-1).forEach(el => cc = cc.tokens[el]);
    cc.tokens[this.props.token[this.props.token.length-1]] = value;
    this.props.update(this.props.card);
  }

  newToken() {
      
    var token = Object.assign({}, this.props.defaultCard);

    this.currentCard.tokens = this.currentCard.tokens || [];
    this.currentCard.tokens.push(token);

    var c = this.props.token;
    c.push(this.currentCard.tokens.length-1);

    this.props.update(this.props.card);
    this.props.setToken(c);
  }

  changeType(newType) {

    var filter = [];
    var basis = {
        archetypes: [],
        mana: "0",
        atk: "200",
        hp: "200",
        range: "1",
        activation: "1",
        lv2: {
          atk: "200",
          range: "1",
          description: "",
          fontSize: 1.3,
          overload: 0
        },
        lvmax: {
          atk: "200",
          range: "1",
          description: "",
          fontSize: 1.3,
          overload: 0
        }
    };
    switch (newType) {
    case "figure": filter = ["lv2", "lvmax", "idColor2", "icon", "activation", "mechactive", "mecha"]; break;
    case "hero": filter = ["archetypes", "mana", "icon", "activation", "mechactive", "mecha"]; break;
    case "spell":
    case "secret":
    case "world": filter = ["lv2", "lvmax", "idColor2", "archetypes", "atk", "hp", "range", "icon", "activation", "mechactive", "mecha"]; break;
    case "seal": filter = ["lv2", "lvmax", "idColor2", "archetypes", "atk", "hp", "range", "mana", "activation", "mechactive", "mecha"]; break;
    case "artifact": filter = this.currentCard.mecha ? ["lv2", "lvmax", "idColor2", "archetypes", "icon"]
      : ["lv2", "lvmax", "idColor2", "archetypes", "atk", "range", "activation", "mechactive", "icon"]; break;
    default: break;
    }

    var n = Object.assign({}, basis, this.currentCard, {cardType: newType});
    filter.forEach(f => delete n[f]);
    if (newType === "hero")
      n.idColor2 = 0;
    
    this.currentCard = n;
  }
  
  render() {

    var editAttribute = attr => (e => {
      this.currentCard[attr] = e.target.value;
      if (typeof this.currentCard[attr] === 'string') {
        this.currentCard[attr].replace(/[\u0250-\ue007]/g, '');
        if (this.currentCard[attr].length > 120) {
          if (attr !== "description")
            this.currentCard[attr] = this.currentCard[attr].substring(0, 99);
          else if (this.currentCard[attr].length > 300)
            this.currentCard[attr] = this.currentCard[attr].substring(0, 299);
        }
      }
      this.props.update(this.props.card);
    });

    var editLevelAttribute = attr => ((e, l) => {
      l[attr] = e.target.value;
      if (typeof l[attr] === 'string') l[attr].replace(/[\u0250-\ue007]/g, '');
      this.props.update(this.props.card);
    });

    var changeArchetypes = (ar1, ar2) => {
      var ars = [];
      if (ar1 && ar1 !== "")
        ars.push(ar1.toLowerCase());
      if (ar2 && ar2 !== "")
        ars.push(ar2.toLowerCase());
      this.currentCard.archetypes = ars;
     this.props.update(this.props.card);
    };

    var changeColor = idColor => () => {
      this.currentCard.idColor = idColor;
      this.props.update(this.props.card);
    };

    var changeColor2 = idColor => () => {
      this.currentCard.idColor2 = idColor;
      this.props.update(this.props.card);
    };

    var shadow = Object.assign({}, this.currentCard);
    delete shadow.idCardmodel;
    delete shadow.idEdition;
    delete shadow.rarity;
    delete shadow.htmlDescription;
    delete shadow.author;
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

    var superCode = window.btoa(JSON.stringify(shadow).replace(/"[^\x00-\x7Fàéçâîôêûöïüëäè]"/g, ""));

    var currentLevel = this.currentCard.cardType !== "hero" ? (this.currentCard.cardType === "artifact" && this.currentCard.mecha ? (this.state.level === 1 ? this.currentCard : this.currentCard.mechactive) : null) : (this.state.level === 1 ? this.currentCard : (this.state.level === 2 ? this.currentCard.lv2 : this.currentCard.lvmax));


    const handleImage = (event, imgtype) => {

      if (event.target.files.length < 1) return;
      var name = event.target.files[0].name;
      if (name.length > 25)
        name = name.substring(0, 24);

      var reader = new FileReader();
      var that = this;

      reader.addEventListener("load", function(e) {

        let data = new FormData();
        data.append('image', e.target.result.split(',')[1]);

        var requestOptions = {
          method: 'POST',
          body: data,
          redirect: 'follow'
        };

        fetch('https://api.imgbb.com/1/upload?key=' + IMGBB_API_KEY, requestOptions).then(response => response.json())
        .then(data => {
          if (data.status === 200) {
            that.currentCard[imgtype] = data.data.url;
            that.props.update(that.props.card);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      }); 
      
      reader.readAsDataURL( event.target.files[0] );
    };

    return (
      <div className={this.props.className}>
        <div className="half-section">
          <div className="editor-box">
            <Form>
              <FormGroup>
                <div className="types-group vintage-radio">
                  <Input id="hero-card" type="radio" name="sensuba-type" onChange={() => this.changeType("hero")} checked={this.currentCard.cardType === "hero"}/>
                  <Label for="hero-card">Héros</Label>
                  <Input id="figure-card" type="radio" name="sensuba-type" onChange={() => this.changeType("figure")} checked={this.currentCard.cardType === "figure"}/>
                  <Label for="figure-card">Figure</Label>
                  <Input id="spell-card" type="radio" name="sensuba-type" onChange={() => this.changeType("spell")} checked={this.currentCard.cardType === "spell"}/>
                  <Label for="spell-card">Sort</Label>
                  <Input id="artifact-card" type="radio" name="sensuba-type" onChange={() => this.changeType("artifact")} checked={this.currentCard.cardType === "artifact"}/>
                  <Label for="artifact-card">Artéfact</Label>
                  <Input id="secret-card" type="radio" name="sensuba-type" onChange={() => this.changeType("secret")} checked={this.currentCard.cardType === "secret"}/>
                  <Label for="secret-card">Secret</Label>
                  <Input id="seal-card" type="radio" name="sensuba-type" onChange={() => this.changeType("seal")} checked={this.currentCard.cardType === "seal"}/>
                  <Label for="seal-card">Sceau</Label>
                </div>
              </FormGroup>
              <FormGroup>
                <Label for="form-card-name">Nom</Label>
                <Input id="form-card-name" type="text" value={this.currentCard.nameCard} onChange={editAttribute("nameCard").bind(this)}/>
              </FormGroup>
              {
                this.currentCard.cardType !== "hero" ?
                  <FormGroup>
                      <Label for="form-card-anime">Anime</Label>
                      <Input id="form-card-anime" type="text" value={this.currentCard.anime} onChange={editAttribute("anime").bind(this)}/>
                  </FormGroup>
                  :
                  <FormGroup>
                      <div className="two-thirds-section">
                        <Label for="form-card-anime">Anime</Label>
                        <Input id="form-card-anime" type="text" value={this.currentCard.anime} onChange={editAttribute("anime").bind(this)}/>
                      </div>
                      <div className="third-section">
                        <Label for="form-card-hp">PV</Label>
                        <Input id="form-card-hp" type="number" min="100" max="9999" step="100" value={this.currentCard.hp} onChange={editAttribute("hp").bind(this)}/>
                      </div>
                  </FormGroup>
              }
              <FormGroup>
                <div className="half-section">
                  <Label>Couleur</Label>
                  <div className="colors-group">
                    <Input id="neutral-mana" type="radio" name="sensuba-color" onChange={changeColor(0)} checked={this.currentCard.idColor === 0}/>
                    <Label for="neutral-mana"/>
                    <Input id="white-mana" type="radio" name="sensuba-color" onChange={changeColor(1)} checked={this.currentCard.idColor === 1}/>
                    <Label for="white-mana"/>
                    <Input id="red-mana" type="radio" name="sensuba-color" onChange={changeColor(2)} checked={this.currentCard.idColor === 2}/>
                    <Label for="red-mana"/>
                    <Input id="blue-mana" type="radio" name="sensuba-color" onChange={changeColor(3)} checked={this.currentCard.idColor === 3}/>
                    <Label for="blue-mana"/>
                    <Input id="green-mana" type="radio" name="sensuba-color" onChange={changeColor(4)} checked={this.currentCard.idColor === 4}/>
                    <Label for="green-mana"/>
                    <Input id="black-mana" type="radio" name="sensuba-color" onChange={changeColor(5)} checked={this.currentCard.idColor === 5}/>
                    <Label for="black-mana"/>
                  </div>
                </div>
                {
                  this.currentCard.cardType !== "hero" ? (
                      this.currentCard.cardType !== "seal" ? 
                    <div className="half-section">
                      <Label for="form-card-mana">Mana</Label>
                      <Input id="form-card-mana" type="number" min="0" max="9" value={this.currentCard.mana} onChange={editAttribute("mana").bind(this)}/>
                    </div> : "")
                    :
                    <div className="half-section">
                      <Label>Couleur 2</Label>
                      <div className="colors-group">
                        <Input id="neutral-mana-2" type="radio" name="sensuba-color-2" onChange={changeColor2(0)} checked={this.currentCard.idColor2 === 0}/>
                        <Label for="neutral-mana-2"/>
                        <Input id="white-mana-2" type="radio" name="sensuba-color-2" onChange={changeColor2(1)} checked={this.currentCard.idColor2 === 1}/>
                        <Label for="white-mana-2"/>
                        <Input id="red-mana-2" type="radio" name="sensuba-color-2" onChange={changeColor2(2)} checked={this.currentCard.idColor2 === 2}/>
                        <Label for="red-mana-2"/>
                        <Input id="blue-mana-2" type="radio" name="sensuba-color-2" onChange={changeColor2(3)} checked={this.currentCard.idColor2 === 3}/>
                        <Label for="blue-mana-2"/>
                        <Input id="green-mana-2" type="radio" name="sensuba-color-2" onChange={changeColor2(4)} checked={this.currentCard.idColor2 === 4}/>
                        <Label for="green-mana-2"/>
                        <Input id="black-mana-2" type="radio" name="sensuba-color-2" onChange={changeColor2(5)} checked={this.currentCard.idColor2 === 5}/>
                        <Label for="black-mana-2"/>
                      </div>
                    </div>
                }
              </FormGroup>
              {
                this.currentCard.cardType === "figure" ?
                <FormGroup>
                  <div className="half-section">
                    <Label for="form-card-archetype1">Archétype 1</Label>
                    <Input id="form-card-archetype1" type="text" value={(this.currentCard.archetypes && this.currentCard.archetypes.length > 0) ? this.currentCard.archetypes[0] : ""} onChange={e => changeArchetypes(e.target.value, document.getElementById("form-card-archetype2").value)}/>
                  </div>
                  <div className="half-section">
                    <Label for="form-card-archetype2">Archétype 2</Label>
                    <Input id="form-card-archetype2" type="text" value={(this.currentCard.archetypes && this.currentCard.archetypes.length > 1) ? this.currentCard.archetypes[1] : ""} onChange={e => changeArchetypes(document.getElementById("form-card-archetype1").value, e.target.value)}/>
                  </div>
                </FormGroup> : <span/>
              }
              {
                this.currentCard.cardType === "figure" ?
                <FormGroup>
                  <div className="third-section">
                    <Label for="form-card-atk">ATK</Label>
                    <Input id="form-card-atk" type="number" min="0" max="9999" step="100" value={this.currentCard.atk} onChange={editAttribute("atk").bind(this)}/>
                  </div>
                  <div className="third-section">
                    <Label for="form-card-hp">PV</Label>
                    <Input id="form-card-hp" type="number" min="100" max="9999" step="100" value={this.currentCard.hp} onChange={editAttribute("hp").bind(this)}/>
                  </div>
                  <div className="third-section">
                    <Label for="form-card-range">Portée</Label>
                    <Input id="form-card-range" type="number" min="1" max="3" value={this.currentCard.range} onChange={editAttribute("range").bind(this)}/>
                  </div>
                </FormGroup> : <span/>
              }
              {
                this.currentCard.cardType === "hero" ?
                <div className="editor-menu">
                  <div className="editor-menu-tabs">
                    <Input id="level1-tab" type="radio" onChange={() => this.setState({level: 1})} checked={this.state.level === 1}/>
                    <Label for="level1-tab">Niv 1</Label>
                    <Input id="level2-tab" type="radio" onChange={() => this.setState({level: 2})} checked={this.state.level === 2}/>
                    <Label for="level2-tab">Niv 2</Label>
                    <Input id="levelmax-tab" type="radio" onChange={() => this.setState({level: 3})} checked={this.state.level === 3}/>
                    <Label for="levelmax-tab">Niv MAX</Label>
                  </div>
                  <div className="editor-box">
                    <FormGroup>
                      <div className="half-section">
                        <Label for="form-card-atk">ATK</Label>
                        <Input id="form-card-atk" type="number" min="0" max="9999" step="100" value={currentLevel.atk} onChange={e => editLevelAttribute("atk")(e, currentLevel)}/>
                      </div>
                      <div className="half-section">
                        <Label for="form-card-range">Portée</Label>
                        <Input id="form-card-range" type="number" min="1" max="3" value={currentLevel.range} onChange={e => editLevelAttribute("range")(e, currentLevel)}/>
                      </div>
                    </FormGroup>
                    <FormGroup>
                      <div className="two-thirds-section">
                        <Label for="form-card-description">Description</Label>
                        <Input id="form-card-description" rows="4" type="textarea" value={currentLevel.description} onChange={e => editLevelAttribute("description")(e, currentLevel)}/>
                      </div>
                      <div className="third-section">
                        <Label for="form-card-font-size">Taille du texte</Label>
                        <Input id="form-card-font-size" type="number" min="0.9" max="1.3" step="0.05" value={currentLevel.fontSize} onChange={e => editLevelAttribute("fontSize")(e, currentLevel)}/>
                        <Label for="form-card-overload">Limite</Label>
                        <Input id="form-card-overload" type="number" min="0" max="10000" step="10" value={currentLevel.overload} onChange={e => editLevelAttribute("overload")(e, currentLevel)}/>
                      </div>
                    </FormGroup>
                  </div>
                </div> : <span/>
              }
              {
                this.currentCard.cardType === "artifact" ?
                <FormGroup>
                  <div className="two-thirds-section">
                    <Label for="form-card-hp">Durabilité</Label>
                    <Input id="form-card-hp" type="number" min="100" max="9999" step="100" value={this.currentCard.hp} onChange={editAttribute("hp").bind(this)}/>
                  </div>
                  <div className="third-section">
                  { true ?
                    <div>
                    <Label for="form-card-mecha">Mech</Label>
                    <div>
                      <Input id="form-card-mecha" className="form-card-checkbox" type="checkbox" checked={this.currentCard.mecha === true} onChange={() => {
                        this.currentCard.mecha = !this.currentCard.mecha;
                        if (this.currentCard.mecha) {
                          this.currentCard.atk = "200";
                          this.currentCard.range = "1";
                          this.currentCard.activation = "1";
                          this.currentCard.mechactive = {
                            description: "",
                            fontSize: 1.3,
                            overload: 0
                          }
                        }
                        this.props.update(this.props.card);
                      }}/>
                    </div>
                    </div> : ""
                  }
                  </div>
                </FormGroup> : <span/>
              }
              {
                this.currentCard.cardType === "artifact" && this.currentCard.mecha ?
                <FormGroup>
                  <div className="third-section">
                    <Label for="form-card-atk">ATK</Label>
                    <Input id="form-card-atk" type="number" min="100" max="9999" step="100" value={this.currentCard.atk} onChange={editAttribute("atk").bind(this)}/>
                  </div>
                  <div className="third-section">
                    <Label for="form-card-range">Portée</Label>
                    <Input id="form-card-range" type="number" min="1" max="3" value={this.currentCard.range} onChange={editAttribute("range").bind(this)}/>
                  </div>
                  <div className="third-section">
                    <Label for="form-card-range">Activation</Label>
                    <Input id="form-card-range" type="number" min="1" max="99" value={this.currentCard.activation} onChange={editAttribute("activation").bind(this)}/>
                  </div>
                </FormGroup> : <span/>
              }
              {
                this.currentCard.cardType === "artifact" && this.currentCard.mecha ?
                <div className="editor-menu">
                  <div className="editor-menu-tabs">
                    <Input id="base-tab" type="radio" onChange={() => this.setState({level: 1})} checked={this.state.level === 1}/>
                    <Label for="base-tab">Base</Label>
                    <Input id="activated-tab" type="radio" onChange={() => this.setState({level: 2})} checked={this.state.level === 2}/>
                    <Label for="activated-tab">Activé</Label>
                  </div>
                  <div className="editor-box">
                    <FormGroup>
                      <div className="two-thirds-section">
                        <Label for="form-card-description">Description</Label>
                        <Input id="form-card-description" rows="4" type="textarea" value={currentLevel.description} onChange={e => editLevelAttribute("description")(e, currentLevel)}/>
                      </div>
                      <div className="third-section">
                        <Label for="form-card-font-size">Taille du texte</Label>
                        <Input id="form-card-font-size" type="number" min="0.9" max="1.3" step="0.05" value={currentLevel.fontSize} onChange={e => editLevelAttribute("fontSize")(e, currentLevel)}/>
                        <Label for="form-card-overload">Limite</Label>
                        <Input id="form-card-overload" type="number" min="0" max="10000" step="10" value={currentLevel.overload} onChange={e => editLevelAttribute("overload")(e, currentLevel)}/>
                      </div>
                    </FormGroup>
                  </div>
                </div> : <span/>
              }
              {
                this.currentCard.cardType !== "hero" && !this.currentCard.mecha ?
                <FormGroup>
                <div className="two-thirds-section">
                  <Label for="form-card-description">Description</Label>
                  <Input id="form-card-description" rows="4" type="textarea" value={this.currentCard.description} onChange={editAttribute("description").bind(this)}/>
                </div>
                <div className="third-section">
                  <Label for="form-card-font-size">Taille du texte</Label>
                  <Input id="form-card-font-size" type="number" min="0.9" max="1.3" step="0.05" value={this.currentCard.fontSize} onChange={editAttribute("fontSize").bind(this)}/>
                  <Label for="form-card-overload">Limite</Label>
                  <Input id="form-card-overload" type="number" min="0" max="10000" step="10" value={this.currentCard.overload} onChange={editAttribute("overload").bind(this)}/>
                </div>
              </FormGroup> : <span/>
              }
              <FormGroup>
                <Label for="form-card-flavour">Texte d'ambiance</Label>
                <Input id="form-card-flavour" type="textarea" value={this.currentCard.flavourText} onChange={editAttribute("flavourText").bind(this)}/>
              </FormGroup>
              <FormGroup>
                <Label for="form-card-category">Catégorie</Label>
                <Input id="form-card-category" type="text" value={this.currentCard.category || ""} onChange={editAttribute("category").bind(this)}/>
              </FormGroup>
              <FormGroup>
                <Label for="form-card-img">Lien de l'image</Label>
                <Input id="form-card-img" type="url" value={this.currentCard.imgLink} onChange={editAttribute("imgLink").bind(this)}/>
                <div className="form-upload-img"><Input type="file" accept="image/*" name="imagefile" onChange={e => handleImage(e, "imgLink")} /></div>
              </FormGroup>
              <FormGroup>
                <Label for="form-card-highres">Image en haute résolution</Label>
                <Input id="form-card-highres" type="url" value={this.currentCard.highRes} onChange={editAttribute("highRes").bind(this)}/>
                <div className="form-upload-img"><Input type="file" accept="image/*" name="highresfile" onChange={e => handleImage(e, "highRes")} /></div>
              </FormGroup>
              {
                this.currentCard.cardType === "seal" ?
                <FormGroup>
                  <Label for="form-card-icon">Icone du sceau</Label>
                  <Input id="form-card-icon" type="url" value={this.currentCard.icon} onChange={editAttribute("icon").bind(this)}/>
                  <div className="form-upload-img"><Input type="file" accept="image/*" name="iconfile" onChange={e => handleImage(e, "icon")} /></div>
                </FormGroup> : ""
              }
              <FormGroup>
                <Label for="form-card-illustrator">Illustrateur</Label>
                <Input id="form-card-illustrator" type="text" value={this.currentCard.illustrator || ""} onChange={editAttribute("illustrator").bind(this)}/>
              </FormGroup>
            </Form>
          </div>
        </div>
        <div className="half-section">
          <div className="editor-card-visual">
            <Card id="card-preview" level={this.state.level} mechactive={this.state.level === 2} src={this.currentCard}/>
            {
              this.currentCard.cardType === "seal" ?
                <div className="seal-preview">
                  <div className="sensuba-seal-icon">
                    <img id={this.currentCard.id + "-icon"} crossOrigin="Anonymous" className="sensuba-seal-icon-img" src={this.currentCard.icon || '/cards/neutralblack.png'} alt={this.currentCard.nameCard + " icon"}/>
                  </div>
                </div> : ""
            }
            { this.props.token.length === 0 ? <button className="menu-button" onClick={() => this.props.save()}>{ this.props.isEdit ? "Modifier" : "Enregistrer" }</button> : <span/> }
            { this.props.card.idCardmodel !== undefined || this.props.token.length > 0 ? <button className="red menu-button" onClick={() => this.props.delete()}>Supprimer</button> : <span/> }
            <div className="editor-box">
              <Label for="form-card-supercode">Supercode</Label>
              <Input id="form-card-supercode" type="textarea" rows="8" value={superCode} onChange={ e => {
                  try {
                      this.currentCard = JSON.parse(window.atob(e.target.value));
                  } catch (e) { }
              } }/>
            </div>
            <div className="token-menu">
              {
                this.props.token.length > 0 ? <button className="menu-button" onClick={() => this.props.setToken(this.props.token.slice(0,-1))}>Parent</button> : <span/>
              }
              {
                (() => {

                  if (this.currentCard.tokens)
                    return this.currentCard.tokens.map((token, i) => <button key={i} className="menu-button" onClick={() => this.props.setToken(this.props.token.concat([i]))}>{ token.nameCard }</button>)
                  return null;
                })()
              }
              <button className="red menu-button" onClick={() => this.newToken()}>Nouveau jeton</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}