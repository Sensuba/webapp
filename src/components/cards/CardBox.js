import React, { Component } from 'react';
import './CardBox.css';
import Card from './Card';
import Hero from './Hero';
import Ability from './Ability';
import Lightbox from '../utility/Lightbox';
import { Tooltip } from 'reactstrap';
import Library from '../../scene/utility/Library';

import { read } from '../../TextManager';

const keywordIcons = ["shield", "reach", "drain", "ephemeral", "burst", "warden", "undying", "freeze", "agility", "exalted"];

export default class CardBox extends Component {

	state={ token: [] }

	constructor (props) {

		super (props);

		this.state.level = props.level;
	}

	toggleTooltip(f) {

		this.setState({tooltip: this.state.tooltip === f ? null : f})
	}

	get current () { return this.state.token.length > 0 ? this.state.token[this.state.token.length - 1] : this.props.src }

	computeEffect () {

		if (!this.current.effect)
			return [];
		let text = this.current.effect;
		let splits = [];
		// eslint-disable-next-line
		let texts = text.split(/\[[^\[]+\]|\{[^\{]+\}|\n/);
		// eslint-disable-next-line
		let matches = text.match(/\[[^\[]+\]|\{[^\{]+\}|\n/g);
		if (matches)
			matches.forEach((match,i) => {
				let el = match.slice(1, -1);
				splits.push(<span key={i+"a"}>{ texts[i] }</span>);
				if (match[0] === '{') {
					let slices = el.split('/');
					let key = slices[0];
					let ntoken = this.state.token.slice(); ntoken.push(Library.cards[key]);
					splits.push(<span onClick={() => this.setState({tooltip: null, token: ntoken})} key={i} className="token" id={'effect-' + i}>{ slices.length > 1 ? slices[1] : Library.cards[key].name }</span>);
				} else if (match[0] === '[') {
					splits.push(<span key={i} className={"keyword " + (el.startsWith("half") ? "soft" : "")} id={'effect-' + i} onClick={() => this.toggleTooltip(i)}>{keywordIcons.includes(el) ? <img className="keyword-icon" src={"/images/icons/" + el + ".png"} alt=""/> : ""}{read('keywords/' + el)}</span>);
					splits.push(<Tooltip key={i+"t"} className="tooltip" placement="top" isOpen={this.state.tooltip === i} target={"effect-" + i} toggle={() => this.toggleTooltip(i)}>{ read('keywords/description/' + el) }</Tooltip>);
				} else if (match[0] === '\n') {
					splits.push(<br key={i}/>);
				}
			});
		splits.push(<span key={"end"}>{ texts[texts.length-1] }</span>);
		return splits;
	}

	render () {

		window.focus = this.current;
		let ability = this.current.type === "lv2" || this.current.type === "lvmax" || this.current.type === "aura";
		let colors = this.current.colors || (this.current.color ? [this.current.color] : []);

		return(
			<Lightbox className="cardbox-focus-box" open={this.props.open} onClose={this.props.onClose}>
	          <div className="cardbox-focus">
	            <div className={"cardbox-focus-card" + (ability ? " cardbox-focus-ability" : "") }>{ this.current.colors ? <div onClick={() => this.setState({level: ((this.state.level || 1)%3+1)})}><Hero level={this.state.level} src={this.current}/></div> : (ability ? <Ability src={this.current}/> : <Card src={this.current}/>) }</div>
	            <h1 className={ this.current.name.length >= 25 ? "small-name" : ""}>{this.current.name}</h1>
	            {
	            	ability ? <div className="card-typing">{ this.current.type === "aura" ? read('cards/aura') : read('cards/skill') }</div> :
	            	(read('system/categorylast') ? <div className="card-typing"><span className="card-type">{ read('cards/' + this.current.type) }</span>{ this.current.categories ? this.current.categories.map(category => <span key={category} className="card-category">&nbsp;{ read('cards/categories/' + category) }</span>) : "" }</div>
	            	: <div className="card-typing">{ this.current.categories ? [...this.current.categories].reverse().map(category => <span key={category} className="card-category">{ read('cards/categories/' + category) }&nbsp;</span>) : "" }<span className="card-type">{ read('cards/' + this.current.type) }</span></div>)
	            }
	            {
	            	this.current.colors ?
	            	<div className="cardbox-abilities">
	            		<div className="cardbox-lv">
	            			<div className="cardbox-ability" onClick={() => this.setState({tooltip: null, token: [this.props.src.abilities[0]]})}><Ability src={this.props.src.abilities[0]}/></div>
	            			<div className="cardbox-ability" onClick={() => this.setState({tooltip: null, token: [this.props.src.abilities[1]]})}><Ability src={this.props.src.abilities[1]}/></div>
	            		</div>
	            		<div className="cardbox-lv-separator"/>
	            		<div className="cardbox-lv">
	            			<div className="cardbox-ability" onClick={() => this.setState({tooltip: null, token: [this.props.src.abilities[2]]})}><Ability src={this.props.src.abilities[2]}/></div>
	            			<div className="cardbox-ability" onClick={() => this.setState({tooltip: null, token: [this.props.src.abilities[4]]})}><Ability src={this.props.src.abilities[4]}/></div>
	            			<div className="cardbox-ability" onClick={() => this.setState({tooltip: null, token: [this.props.src.abilities[3]]})}><Ability src={this.props.src.abilities[3]}/></div>
	            		</div>
	            	</div>
	            	: <p className="game-effect">{ this.computeEffect() }</p>
	            }
	            <div className="cardbox-side cardbox-left">
	            </div>
	            <div className="cardbox-side cardbox-right">
	             	{ colors.map(c => <div key={c} className="cardbox-color">{ read('cards/' + c).toLowerCase() }</div>) }
	            </div>
	            { this.state.token.length > 0 ? <div className="cardbox-back-to-parent" onClick={() => this.setState({tooltip: null, token: this.state.token.length > 1 ? this.state.token.slice(0, this.state.token.length-1) : [] })}>{ this.state.token.length > 1 ? this.state.token[this.state.token.length-2].name : this.props.src.name }</div> : "" }
	          </div>
	        </Lightbox>
		);
	}
}