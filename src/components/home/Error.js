import React, { Component } from 'react';
import './Error.css';
import Nav from '../nav/Nav';
import Flowers from '../other/flowers/Flowers';
import StoryText from '../text/StoryText';

export default class Error extends Component {

  constructor (props) {

    super(props);

    this.state = {}
    if (this.props.startup)
      this.timeout = setTimeout(() => { this.setState({display: false}); delete this.timeout; }, this.props.startup);
    else this.state.display = false;
  }

  componentWillUnmount() {

    if (this.timeout)
      clearTimeout(this.timeout);
  }

  render () {

    return (
      <div className={"main-page error-page" + (this.props.dark ? "" : " light")}>
        <Flowers/>
        <Nav/>
        <div className="main">
          <StoryText className={ this.state.display ? "" : "fade-text" }>{ this.props.children }</StoryText>
        </div>
      </div>
    );
  }
}

