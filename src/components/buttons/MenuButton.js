import React from 'react';
import './MenuButton.css';
import BasicButton from './BasicButton';

export default class MenuButton extends BasicButton {

  name = 'menu-button';

  renderButton () {

    return ( <div className="menu-button-text">{ this.props.children }</div> )
  }
}

