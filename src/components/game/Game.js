import React, { Component } from 'react';
import './Game.css';
import Nav from '../nav/Nav';
import Scene from '../../scene/Scene';

export default class Game extends Component {

  render () {

    return (
      <div className="main-page game-page">
        <Nav/>
        <Scene/>
      </div>
    );
  }
}

