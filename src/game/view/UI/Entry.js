import React, { Component } from 'react';

const SECRET_PREVIEW = {
  cardType: "secret",
  nameCard: "Secret Inconnu",
  anime: "",
  description: "",
  flavourText: "",
  imgLink: "/game/secret.png",
  mana: 1
}

export default class Entry extends Component {

  showTooltip(e, card, left) {

  	var tooltip = document.getElementById("img-preview-tooltip");
    if (e.pageX < 400)
      left = false;
  	tooltip.setAttribute("style", `display: block; top: ${e.pageY > window.innerHeight * 0.74 - 60 + window.scrollY ? window.innerHeight * 0.74 - 60 + window.scrollY : (e.pageY < 140 + window.innerHeight * 0.2 ? 140 + window.innerHeight * 0.2 : e.pageY)}px; left: ${e.pageX}px; margin-left: ${left ? -18 : 4}em;`);
  	var src = card && card.eff ? card.eff : card;
    var target = this.props.value.target ? (this.props.value.target.eff || this.props.value.target) : undefined;
    if (this.props.value.type === "play" && card.cardType === "secret") {
      target = undefined;
      if (!src.nameCard)
        src = SECRET_PREVIEW;
    }
    var icon = undefined, text = this.props.value.text;
    if (text && text.value)
      text = text.value;
    if (target) {
      switch (this.props.value.type) {
      case "play":
      case "action":
      case "attack":
      case "skill": icon = this.props.value.type; break;
      default: break;
      }
    }
    this.props.master.updatePreview({ card: src, target, icon, text });
  }

  hideTooltip() {

  	var tooltip = document.getElementById("img-preview-tooltip");
  	tooltip.setAttribute("style", `display: none`);
  }

  componentWillUnmount() {

    if (!this.props.master || !this.props.master.state)
      return;
    if (this.props.master.state.preview === this.props.value.src)
      this.hideTooltip();
  }

  compareModels (a, b) {

    if (a.idCardmodel && b.idCardmodel)
      return a.idCardmodel === b.idCardmodel;
    else if (!a.idCardmodel && !b.idCardmodel) {
      return a.parent === b.parent;
    }
    else return false;
  }

  render () {

    var src = this.props.value.src;
    if (src && this.props.value.model && !this.compareModels(this.props.value.src, this.props.value.model))
      src = this.props.value.model;

    return (
    	<div
    	className={"history-entry history-" + this.props.value.type + ( this.props.value.option ? (" option-" + this.props.value.option) : "" )}
        onMouseMove={e => this.showTooltip(e, src, true)}
        onMouseLeave={e => this.hideTooltip()}
        >
    		{ src ? <img className="history-entry-bg" src={this.props.value.type === "play" && src.cardType === "secret" ? "/game/secret.png" : (src.imgLink || "/game/back.png")} alt="History card preview"/> : <span/> }
		</div>
    )
  }
}