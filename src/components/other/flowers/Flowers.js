import React, { Component } from 'react';
import Flower from './Flower';
import './Flowers.css';

export default class Flowers extends Component {

  render () {

    return (
      <div className="flower-wrapper">
        <div className="flowers">
          { [-15, -36, 0, -44, -18, -34, -54, -8, -44, -20].map((d, i) => <Flower key={i} shift={i*12-60} delay={d}/>) }
        </div>
      </div>
    );
  }
}

