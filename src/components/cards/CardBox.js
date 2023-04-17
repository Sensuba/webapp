import React, { Component } from 'react';
import './CardBox.css';
import Card from './Card';
import Hero from './Hero';
import Ability from './Ability';
import Lightbox from '../utility/Lightbox';
import { Tooltip } from 'reactstrap';
import Library from '../../scene/utility/Library';

import { read } from '../../TextManager';
import { getMusic, play, stopMusic } from '../../SoundManager';

const keywordIcons = ["shield", "reach", "drain", "ephemeral", "burst", "warden", "undying", "freeze", "agility", "exalted", "initiative", "trap"];

export default class CardBox extends Component {

	state={ token: [], mask: false }

	constructor (props) {

		super (props);

		this.state.level = props.level;
	}

	  componentDidMount () {

    	document.addEventListener("keydown", e => {
	    	switch(e.keyCode) {
	        case 77:
	            this.setState({mask: !this.state.mask});
	            break;
	        default: 
	            break;
	        }
	    });
	  }

	  componentWillUnmount () {

	    document.removeEventListener("keydown", this._handleKeyDown);
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
					let repeat = this.current.key && key === this.current.key.toString();
					splits.push(<span onClick={repeat ? () => {} : () => this.setState({tooltip: null, token: ntoken})} key={i} className={"token" + (repeat ? " repeat-token" : "")} id={'effect-' + i}>{ slices.length > 1 ? slices[1] : Library.cards[key].name }</span>);
				} else if (match[0] === '[') {
					let slices = el.split('/');
					let keyword = slices[0];
					splits.push(<span key={i} className={"keyword " + (keyword.startsWith("half") || keyword === "volatile" ? "soft" : "")} id={'effect-' + i} onClick={() => this.toggleTooltip(i)}>{keywordIcons.includes(keyword) ? <img className="keyword-icon" src={"/images/icons/" + keyword + ".png"} alt=""/> : ""}{slices.length > 1 ? slices[1] : read('keywords/' + keyword)}</span>);
					splits.push(<Tooltip key={i+"t"} className="tooltip" placement="top" isOpen={this.state.tooltip === i} target={"effect-" + i} toggle={() => this.toggleTooltip(i)}>{ read('keywords/description/' + keyword) }</Tooltip>);
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

		let style = undefined;

		let source = this.props.origin || this.props.src;

		if (source.style)
			style = {background: "linear-gradient(" + source.style.hud.dark + ", " + source.style.hud.light + ")"}

		return(
			<Lightbox style={ style } className={"cardbox-focus-box" + (this.state.mask ? " opaque" : "") + (source.style ? " hero-box" : "")} open={this.props.open} onClose={this.props.onClose}>
	          <div className="cardbox-focus">
	            <div className={"cardbox-focus-card" + (ability ? " cardbox-focus-ability" : "") }>{ this.current.colors ? <div onClick={() => this.setState({level: ((this.state.level || 1)%3+1)})}><Hero level={this.state.level} src={this.current}/></div> : (ability ? <Ability colors={source.colors} src={this.current}/> : <Card src={this.current}/>) }</div>
	            <h1 className={ this.current.name.length >= 25 ? "small-name" : ""}>{this.current.name}</h1>
	            {
	            	ability ? <div className="card-typing">{ this.current.type === "aura" ? read('cards/aura') : read('cards/skill') }</div> :
	            	(read('system/categorylast') ? <div className="card-typing"><span className="card-type">{ read('cards/' + this.current.type) }</span>{ this.current.categories ? this.current.categories.map((category, i) => <span key={category} className="card-category">&nbsp;{ i > 0 ? read('cards/categoryseparator') + " " : "" }{ read('cards/categories/' + category) }</span>) : "" }</div>
	            	: <div className="card-typing">{ this.current.categories ? [...this.current.categories].reverse().map((category, i) => <span key={category} className="card-category">{ i > 0 ? read('cards/categoryseparator') + " " : "" }{ read('cards/categories/' + category) }&nbsp;</span>) : "" }<span className="card-type">{ read('cards/' + this.current.type) }</span></div>)
	            }
	            {
	            	this.current.colors ?
	            	<div className="cardbox-abilities">
	            		<div className="cardbox-lv">
	            			<div className="cardbox-ability" onClick={() => this.setState({tooltip: null, token: [this.props.src.abilities[0]]})}><Ability colors={this.props.src.colors} src={this.props.src.abilities[0]}/></div>
	            			<div className="cardbox-ability" onClick={() => this.setState({tooltip: null, token: [this.props.src.abilities[1]]})}><Ability colors={this.props.src.colors} src={this.props.src.abilities[1]}/></div>
	            		<div className="hero-lv-text">{ read('cards/lv2') }</div>
	            		</div>
	            		<div className="cardbox-lv-separator"/>
	            		<div className="cardbox-lv">
	            			<div className="cardbox-ability" onClick={() => this.setState({tooltip: null, token: [this.props.src.abilities[2]]})}><Ability colors={this.props.src.colors} src={this.props.src.abilities[2]}/></div>
	            			<div className="cardbox-ability" onClick={() => this.setState({tooltip: null, token: [this.props.src.abilities[4]]})}><Ability colors={this.props.src.colors} src={this.props.src.abilities[4]}/></div>
	            			<div className="cardbox-ability" onClick={() => this.setState({tooltip: null, token: [this.props.src.abilities[3]]})}><Ability colors={this.props.src.colors} src={this.props.src.abilities[3]}/></div>
	            		<div className="hero-lv-text">{ read('cards/lvmax') }</div>
	            		</div>
	            	</div>
	            	: <p className={ "game-effect" + (this.current.effect.length >= 125 ? " small-effect" : "")}>{ this.computeEffect() }</p>
	            }
	            <div className="cardbox-side cardbox-left">
	            	{ this.current.theme ? <div className={"cardbox-sound" + (getMusic() === this.current.theme ? " active-sound" : "")} onClick={() => { if (getMusic() === this.current.theme) stopMusic(); else play(this.current.theme, 'music'); this.forceUpdate(); }}><img alt="change-music" src="/images/sound.png"/></div> : ""}
	            </div>
	            <div className="cardbox-side cardbox-right">
	             	{ colors.map(c => <div key={c} className="cardbox-color">{ read('cards/' + c).toLowerCase() }</div>) }
	            </div>
	            { this.state.token.length > 0 ? <div className="cardbox-back-to-parent" onClick={() => this.setState({tooltip: null, token: this.state.token.length > 1 ? this.state.token.slice(0, this.state.token.length-1) : [] })}>{ this.state.token.length > 1 ? this.state.token[this.state.token.length-2].name : this.props.src.name }</div> : "" }
	          </div>
	          { this.props.left && this.state.token.length === 0 && !this.state.mask ? <div onClick={() => this.props.left()} className="cardbox-arrow cardbox-arrow-left"><img alt="" src="/images/arrowhead.png"/></div> : "" }
	          { this.props.right && this.state.token.length === 0 && !this.state.mask ? <div onClick={() => this.props.right()} className="cardbox-arrow cardbox-arrow-right"><img alt="" src="/images/arrowhead.png"/></div> : "" }
	        </Lightbox>
		);
	}
}