import React, { Component } from 'react';
import View from '../../../components/cards/Card';

export default class Card extends Component {

  showTooltip(e, card, left) {

  	var tooltip = document.getElementById("img-preview-tooltip");
    if (e.pageX < 300)
      left = false;
  	tooltip.setAttribute("style", `display: block; top: ${e.pageY > window.innerHeight - 200 + window.scrollY ? window.innerHeight - 200 + window.scrollY : e.pageY}px; left: ${e.pageX}px; margin-left: ${left ? -18 : 4}em`);
  	this.props.master.setState({preview: card.eff});
  }

  hideTooltip() {

  	var tooltip = document.getElementById("img-preview-tooltip");
  	tooltip.setAttribute("style", `display: none`);
  }

  componentWillUnmount() {

    if (this.props.master.state.preview === this.props.model)
      this.hideTooltip();
  }

  render () {

    var model = this.props.model;
    var master = this.props.master;

    var visible = model.nameCard && (model.location.public || model.area === master.state.model.areas[master.no]);

    return (
      <div
        id={"sensuba-card-" + model.id.no}
        style={this.props.style}
        onMouseMove={visible ? e => this.showTooltip(e, model, true) : e => {}}
        onMouseLeave={visible ? e => this.hideTooltip() : e => {}}
        className={"sensuba-card-view" + (model.hasState("flying") ? " flying" : "") + (model.concealed ? " concealed" : "") + (model.firstTurn && !model.hasState("rush") && model.area.isPlaying ? " firstturn" : "") + (this.props.hidden ? " invisible" : "")}
        onClick={e => {
          if (this.props.select) {
            this.props.select(model);
            document.getElementById("faculty-tooltip").setAttribute("style", `top: ${e.pageY}px; left: ${e.pageX}px; margin-left: 4em`);
          }
          e.stopPropagation();
        }}>
      	<View model={model.model} level={model.level} src={visible ? model.eff : null} className={master.manager ? master.manager.controller.haloFor(model) : ""}/>
        { model.hasShield ? <div className="sensuba-card-shield"/> : <span/> }
        { model.frozen ? <div className="sensuba-card-freeze"/> : <span/> }
        { model.concealed ? <div className="sensuba-card-conceal"/> : <span/> }
        { model.exalted && model.onBoard ? <div className="sensuba-card-exalt"/> : <span/> }
        { model.silenced ? <div className="sensuba-card-silence"/> : <span/> }
        { model.hasState("initiative") && model.onBoard ? <div className="sensuba-card-initiative"/> : <span/> }
        { model.hasState("fury") && model.onBoard ? <div className="sensuba-card-fury"/> : <span/> }
        <div className="sensuba-card-covers">{ model.covered ? <div className="sensuba-card-cover"/> : <span/> }{ model.isCovered(true) ? <div className="sensuba-card-cover sensuba-card-cover-air"/> : <span/> }</div>
        <div className="sensuba-card-animmask"/>
      </div>
    )
  }
}