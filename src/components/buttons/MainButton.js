import React, { Component } from 'react';
import './MainButton.css';
import Link from "../utility/Link";
import BasicButton from './BasicButton';

export default class MainButton extends BasicButton {

  name = 'main-button';

  renderButton () {

    return ( <div className="main-button-text">{ this.props.children }</div> )
  }
}

