import React, { Component } from 'react';
import './Nav.css';
import Options from './Options';

//import { read } from '../../TextManager';

export default class Nav extends Component {

  render () {

    return (
      <nav>
        <Options/>
      </nav>
    );
  }
}

