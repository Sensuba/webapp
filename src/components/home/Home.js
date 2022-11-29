import React, { Component } from 'react';
import './Home.css';
import Nav from '../nav/Nav';
import MainButton from '../buttons/MainButton';
import Flowers from '../other/flowers/Flowers';

import { read } from '../../TextManager';

export default class Home extends Component {

  render () {

    return (
      <div className="main-page light home-page">
        <Flowers/>
        <Nav/>
        <div className="main">
          <h1>{ read('menu/title') }</h1>
          <MainButton to="/play">{ read('menu/play') }</MainButton>
          <MainButton>{ read('menu/login') }</MainButton>
        </div>
      </div>
    );
  }
}

