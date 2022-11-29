import React, { Component } from 'react';
import './Ability.css';

export default class Ability extends Component {

	render () {

		return(
			<div className={"sensuba-ability no-select" + (this.props.src.mana === undefined ? " no-mana" : "")}>
				<div className="card-frame"/>
				<div className="card-image-wrapper">
					<img alt="" src={this.props.src.img}/>
				</div>
				<div className="card-mana">{this.props.src.mana}</div>
				{this.props.src.mana === undefined ? "" : <img className="card-manaball" alt="" src="/images/ballmana.png"/> }
			</div>
		);
	}
}