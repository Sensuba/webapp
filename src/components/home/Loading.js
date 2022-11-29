import React, { Component } from 'react';
import './Loading.css';
import Flowers from '../other/flowers/Flowers';
import StoryText from '../text/StoryText';

export default class Loading extends Component {

  constructor (props) {

    super(props);
    this.loadingInterval = setInterval(() => this.setState({suspension: (this.state.suspension+1)%4}), 800);


    this.state = {
      suspension: 1
    }
  }

  componentWillUnmount () {

    clearInterval(this.loadingInterval);
  }

  render () {

    return (
      <div className="main-page light loading-page">
        <Flowers/>
        <div className="main">
          <StoryText>{ this.props.children + ".".repeat(this.state.suspension) }</StoryText>
          <div className="loading-bar"><div style={{width: (this.props.value*120) + "%"}} className="loading-bar-value"/></div>
        </div>
      </div>
    );
  }
}

