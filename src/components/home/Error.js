import React, { Component } from 'react';
import './Error.css';
import Nav from '../nav/Nav';
import Flowers from '../other/flowers/Flowers';
import StoryText from '../text/StoryText';

export default class Error extends Component {

  render () {

    return (
      <div className={"main-page error-page" + (this.props.dark ? "" : " light")}>
        <Flowers/>
        <div className="main">
          <StoryText>{ this.props.children }</StoryText>
        </div>
      </div>
    );
  }
}

