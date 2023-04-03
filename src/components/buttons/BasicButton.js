import React, { Component } from 'react';
import { Button } from 'reactstrap';
import Link from "../utility/Link";

export default class BasicButton extends Component {

  name = 'basic-button';

  constructor (props) {

    super(props);
    this.link = React.createRef();
  }

	renderButton () {

		return ( <div>{ this.props.children }</div> )
	}

  click () {

    if (this.props.onClick)
      this.props.onClick();
    if (this.link && this.link.current)
      this.link.current.link();
  }

  render () {

    let button = this.renderButton();
    let name = this.name;

    if (this.props.to)
      button = (<Link ref={this.link} to={this.props.to}>{button}</Link>);
    
    return (
      <div className={name + '-container ' + (this.props.color ? this.props.color + "-color" : "")}>
        <div className={name + '-wrapper'}>
          <Button onClick={() => this.click()} className={name}>{button}</Button>
        </div>
      </div>
    );
  }
}

