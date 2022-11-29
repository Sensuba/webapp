import React, { Component } from 'react';
import './Hero.css';

export default class Card extends Component {

	render () {

		if (!this.props.src)
			return <div className="sensuba-hero no-select"><img className="card-back-img" alt="" src="/images/back.jpg"/></div>;


		return(
			<div className={"sensuba-hero no-select " + this.props.src.colors[0] + " " + this.props.src.colors[1]}>
				<div className="card-frame"/>
				<div className={"card-image-wrapper" + (!this.props.level || this.props.level === 1 ? "" : " fade")}>
					<img alt="" src={this.props.src.img}/>
				</div>
				<div className={"card-image-wrapper" + (this.props.level === 2 ? "" : " fade")}>
					<img alt="" src={this.props.src['img-lv2']}/>
				</div>
				<div className={"card-image-wrapper" + (this.props.level === 3 ? "" : " fade")}>
					<img alt="" src={this.props.src['img-lvmax']}/>
				</div>
			</div>
		);
	}
}