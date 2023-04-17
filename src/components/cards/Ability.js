import React, { Component } from 'react';
import './Ability.css';

export default class Ability extends Component {

	render () {

		return(
			<div className={"sensuba-ability no-select " + this.props.colors[0] + "-ability " + this.props.colors[1] + "-ability " + (this.props.src.mana === undefined ? " no-mana" : "")}>
				<div className="card-frame no-select"/>
		        <div className="card-image-placeholder">
		          <div className="px"/><div className="px"/><div className="px"/><div className="px"/>
		          <div className="px"/><div className="px"/><div className="px"/><div className="px"/>
		          <div className="px"/><div className="px"/><div className="px"/><div className="px"/>
		          <div className="px"/><div className="px"/><div className="px"/><div className="px"/>
		        </div>
				<div className="card-image-wrapper">
					<img className="no-select" alt="" src={this.props.src.img}/>
				</div>
				<div className="card-mana">{this.props.src.mana}</div>
				{this.props.src.mana === undefined ? "" : <img className="card-manaball no-select" alt="" src="/images/ballmana.png"/> }
			</div>
		);
	}
}