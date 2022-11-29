import React, { Component } from 'react';
import { Button } from 'reactstrap';
import './MenuButton.css';
import Link from "../utility/Link";
import BasicButton from './BasicButton';

export default class MenuButton extends BasicButton {

  name = 'menu-button';

  renderButton () {

    return (
      <div>
        <div className="menu-button-image-box"><img alt="" src={this.props.img}/></div>
        <div className="menu-button-text-box"><div className="menu-button-text-wrapper"><div className="menu-button-text">{ this.props.children }</div></div></div>
      </div>
      )
  }
}

