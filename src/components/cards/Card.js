import React, { Component } from 'react';
import './Card.css';

export default class Card extends Component {

  attackIcon () {

    let model = this.props.src.key ? this.props.src : this.props.src.model;
  	if (!model.states)
  		return "attack";
    let states = ["warden", "burst", "agility", "reach", "initiative", "drain"];
    for (let state in states)
      if (model.states.includes(states[state]))
        return states[state];
    
    return "attack";
  }

  healthIcon () {

    let model = this.props.src.key ? this.props.src : this.props.src.model;
  	if (!model.states)
  		return "heart";
    let states = ["shield", "undying", "exalted", "hidden", "ephemeral"];
    for (let state in states)
      if (model.states.includes(states[state]))
        return states[state];
    
    return "heart";
  }

	render () {

		if (!this.props.src)
			return <div className="sensuba-card no-select"><img className="card-back-img" alt="" src="/images/back.jpg"/></div>;

    let src = this.props.src;
    let model = src.key ? src : src.model;

		return(
			<div className={"sensuba-card no-select " + model.color + "-card"}>
        <div className="card-image-placeholder">
          <div className="px"/><div className="px"/><div className="px"/><div className="px"/>
          <div className="px"/><div className="px"/><div className="px"/><div className="px"/>
          <div className="px"/><div className="px"/><div className="px"/><div className="px"/>
          <div className="px"/><div className="px"/><div className="px"/><div className="px"/>
        </div>
				<div className={"card-image-wrapper" + (src.mana === undefined ? " no-mana" : "")}>
					<img className="no-select" alt="" src={model.img}/>
				</div>
				<div className={"card-mana" + (src.mana < model.mana ? " card-mana-buff" : (src.mana > model.mana ? " card-mana-debuff" : ""))}>{src.mana}</div>
				<img className={"no-select card-frame" + (src.mana === undefined ? " no-mana" : "")} alt="" src={src.mana === undefined ? "/images/frame.png" : "/images/framemana.png"}/>
				{ src.atk ? <div className="card-stat card-atk"><img className="card-stat-icon" alt="" src={"/images/icons/" + this.attackIcon() + ".png"}/><div className={"card-stat-value" + (src.atk > model.atk ? " card-stat-value-buff" : "")}>{src.atk}</div></div> : "" }
        { src.charge ? <div className="card-stat card-atk"><img className="card-stat-icon" alt="" src={"/images/icons/charge.png"}/><div className={"card-stat-value" + (src.charge > model.charge ? " card-stat-value-buff" : "")}>{src.charge}</div></div> : "" }
        { src.hp ? <div className="card-stat card-hp"><img className="card-stat-icon" alt="" src={"/images/icons/" + this.healthIcon() + ".png"}/><div className={"card-stat-value" + (src.hp > model.hp ? " card-stat-value-buff" : "")}>{src.hp}</div></div> : "" }
			</div>
		);
	}
}