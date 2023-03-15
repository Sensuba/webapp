import React, { Component } from 'react';
import './Play.css';
import Nav from '../nav/Nav';
import MenuButton from '../buttons/MenuButton';
import Flowers from '../other/flowers/Flowers';

import { read } from '../../TextManager';

export default class Play extends Component {

  render () {

    return (
      <div className="main-page play-page">
        <Flowers/>
        <Nav/>
        <div className="main">
          <div className="play-buttons">
            <MenuButton to="/story">{ read('menu/story') }</MenuButton>
            <MenuButton to="/multiplayer">{ read('menu/multiplayer') }</MenuButton>
            <MenuButton to="/cards">{ read('menu/collection') }</MenuButton>
            <MenuButton to="/cards">{ read('menu/portalroom') }</MenuButton>
            <MenuButton to="/">{ read('menu/titlescreen') }</MenuButton>
          </div>
        </div>
      </div>
    );
  }
}

