import React from 'react';
import './MainButton.css';
import BasicButton from './BasicButton';

export default class MainButton extends BasicButton {

  name = 'main-button';

  renderButton () {

    return ( <div className="main-button-text">{ this.props.children }</div> )
  }
}

