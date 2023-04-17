import React, { Component } from 'react';
import './Lightbox.css';

export default class Lightbox extends Component {

	render () {

		return(
			<div className={this.props.className + " lightbox-container" + (this.props.open !== true ? " invisible" : "")}>
				<div className="lightbox-inner" onClick={() => this.props.onClose()}>
					<div className="lightbox" style={this.props.style} onClick={e => e.stopPropagation()}>
						{ this.props.children }
					</div>
				</div>
			</div>
		);
	}
}