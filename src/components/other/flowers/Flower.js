import React, { Component } from 'react';

export default class Flower extends Component {

  render () {

    return (
      <div className="background-flower" style={{left: "" + (-4 + this.props.shift) + "rem", animationDelay: "" + this.props.delay + "s"}}/>
    );
  }
}

