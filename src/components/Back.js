import React, { Component } from 'react';
import './Back.css';
import Link from './utility/Link';

export default class Back extends Component {

	render () {

		return(
			<Link to={this.props.to}>
				<div className="back-arrow-wrapper">
					<div className="back-arrow"><img alt="back" className="back-arrow-icon" src="/images/goback.png"/></div>
				</div>
			</Link>
		);
	}
}