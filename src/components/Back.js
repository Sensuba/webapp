import React, { Component } from 'react';
import './Back.css';
import Link from './utility/Link';

import { read } from '../TextManager';

export default class Back extends Component {

	render () {

		if (!this.props.to)
			return (
				<div onClick={() => this.props.onClick()}>
					<div className="back-arrow-wrapper">
						<div className="back-arrow"><img alt="back" className="back-arrow-icon" src="/images/goback.png"/></div>
					</div>
					<div className="back-text">{ read('menu/back') }</div>
				</div>
				)

		return(
			<Link to={this.props.to}>
				<div className="back-arrow-wrapper">
					<div className="back-arrow"><img alt="back" className="back-arrow-icon" src="/images/goback.png"/></div>
				</div>
				<div className="back-text">{ read('menu/back') }</div>
			</Link>
		);
	}
}