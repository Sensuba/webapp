import React, { Component } from 'react';
import { Link as DomLink } from "react-router-dom";

export default class Link extends Component {

  constructor (props) {

    super(props);
    this.domlink = React.createRef();
  }

  link () {

    if (this.clicked) return;
    this.clicked = true;
    document.getElementsByClassName("main-page")[0].classList.add("fade-out");
    setTimeout(() => this.domlink.current.click(), 500);
  }

  render () {

    return (
      <div id={this.props.id} onClick={() => this.link()} className="delay-link">
        <DomLink ref={this.domlink} to={this.props.to}></DomLink>
        <div className="delay-link-content">{this.props.children}</div>
      </div>
    );
  }
}

