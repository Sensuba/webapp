import React, { Component } from 'react';
import './Deck.css';
import Library from '../../scene/utility/Library';

export default class Deck extends Component {

	render () {

		if (!this.props.src)
			return <div className="sensuba-deck no-select"><img className="card-back-img" alt="" src="/images/back.jpg"/></div>;

    	let hero = Library.getHero(this.props.src.body.hero);

		return(
			<div className={"sensuba-deck no-select " + hero.colors[0] + " " + hero.colors[1]}>
				<div className="card-frame"/>
				<div className="card-image-wrapper">
					<img alt="" src={hero['img-lvmax']}/>
					<div className="deck-name">{this.props.src.deckname}</div>
				</div>
			</div>
		);
	}
}