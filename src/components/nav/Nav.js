import React, { Component } from 'react';
import './Nav.css';
import Options from './Options';
import Profile from './Profile';
import Credit from './Credit';

//import { read } from '../../TextManager';

export default class Nav extends Component {

  render () {

    return (
      <nav>
        <Profile/>
        <Options concede={this.props.concede}/>
        <Credit/>
      </nav>
    );
  }
}

