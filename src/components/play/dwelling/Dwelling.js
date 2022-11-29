import React, { Component } from 'react';
import './Dwelling.css';
import Nav from '../../nav/Nav';
import PictureButton from '../../buttons/PictureButton';
import Back from '../../Back';

import { read } from '../../../TextManager';

export default class Dwelling extends Component {

  render () {

    return (
      <div className="main-page dwelling-page">
        <Nav/>
        <div className="main">
          <div className="play-buttons">
            <div className="play-button-wrapper"><PictureButton img="./images/inventory.png" to="/play">{ read('menu/inventory') }</PictureButton></div>
            <div className="play-button-wrapper"><PictureButton img="./images/alchemy.png" to="/play">{ read('menu/laboratory') }</PictureButton></div>
            <div className="play-button-wrapper"><PictureButton img="./images/garden.png" to="/play">{ read('menu/garden') }</PictureButton></div>
            <div className="play-button-wrapper"><PictureButton img="./images/portal.png" to="/play">{ read('menu/portalroom') }</PictureButton></div>
          </div>
        </div>
        <Back to="/play"/>
      </div>
    );
  }
}

