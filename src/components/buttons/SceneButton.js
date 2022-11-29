import React, { Component } from 'react';
import { Button } from 'reactstrap';
import './SceneButton.css';
import Link from "../utility/Link";
import BasicButton from './BasicButton';

export default class SceneButton extends BasicButton {

  name = 'scene-button';

  renderButton () {

    return (
        <div className="scene-button-text">{ this.props.children }</div>
      )
  }
}

