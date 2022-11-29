import React, { Component } from 'react';
import { Button } from 'reactstrap';
import Link from "../utility/Link";

export default class BasicButton extends Component {

  name = 'basic-button';

	renderButton () {

		return ( <div>{ this.props.children }</div> )
	}

  render () {

    let button = this.renderButton();
    let name = this.name;

    if (this.props.to)
      button = (<Link to={this.props.to}>{button}</Link>);

    return (
      <div className={name + '-container'}>
        <div className={name + '-wrapper'}>
          <Button onClick={this.props.onClick} className={name}>{button}</Button>
        </div>
      </div>
    );
  }
}

