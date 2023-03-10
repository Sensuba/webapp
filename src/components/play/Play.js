import React, { Component } from 'react';
import './Play.css';
import Nav from '../nav/Nav';
import BasicButton from '../buttons/BasicButton';
import MenuButton from '../buttons/MenuButton';
import Back from '../Back';

import { read } from '../../TextManager';

export default class Play extends Component {

  render () {

    return (
      <div className="main-page play-page">
        <Nav/>
        <div className="main">
          <div className="play-buttons">
            <div className="play-button-wrapper"><MenuButton img="./images/tree.png" to="/story">{ read('menu/story') }</MenuButton></div>
            <div className="play-button-wrapper"><MenuButton img="./images/multiplayer.png" to="/multiplayer">{ read('menu/multiplayer') }</MenuButton></div>
            <div className="side-button-wrapper left-side"><BasicButton to="/cards"><div className="side-button-img-wrapper"><img src="/images/back.png"/></div><div className="side-button-text-wrapper">{ read('menu/cards') }</div></BasicButton></div>
            <div className="side-button-wrapper right-side"><BasicButton to="/cards"><div className="side-button-img-wrapper"><img src="/images/portal.png"/></div><div className="side-button-text-wrapper">{ read('menu/portals') }</div></BasicButton></div>
            {/*
            <div className="play-button-wrapper"><PictureButton img="./images/dwelling.png" to="/dwelling">{ read('menu/dwelling') }</PictureButton></div>
            <div className="play-button-wrapper"><PictureButton img="./images/bookshelves.png" to="/cards">{ read('menu/cards') }</PictureButton></div> */}
          </div>
        </div>
        <Back to="/"/>
      </div>
    );
  }
}

