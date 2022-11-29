import React, { Component } from 'react';
import { Button } from 'reactstrap';
import './PictureButton.css';
import Link from "../utility/Link";
import BasicButton from './BasicButton';

export default class PictureButton extends BasicButton {

  name = 'picture-button';

  renderButton () {

    return (
      <div>
        <img alt="" src={this.props.img}/>
        <div className="picture-button-text-wrapper"><div className="picture-button-text">{ this.props.children }</div></div>
      </div>
      )
  }
}

