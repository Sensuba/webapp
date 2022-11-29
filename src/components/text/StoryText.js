import React, { Component } from 'react';
import './StoryText.css';

export default class StoryText extends Component {

  render () {

    return (
      <div className="story-text-wrapper"><div className="story-text">{ this.props.children }</div></div>
    );
  }
}

