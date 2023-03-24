import React, { Component } from 'react';
import './Credit.css';
import SocketManager from '../../SocketManager';

import { read } from '../../TextManager';

export default class Credit extends Component {

  state = {
    status: null,
    runes: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).runes : 0,
    shards: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).shards : 0
  }

  componentDidMount () {

    SocketManager.master.onCreditUpdate = (runes, shards) => this.setState({runes, shards});
  }

  componentWillUnmount () {

    delete SocketManager.master.onCreditUpdate;
  }

  render () {

    return (
      <div className="nav-item nav-credit">
        <div className="nav-credit-count nav-shards-count">{ Math.min(this.state.shards, 99999) }</div>
        <div className="shards-icon"/>
        <div className="nav-credit-count">{ Math.min(this.state.runes, 99999) }</div>
        <div className="runes-icon"/>
      </div>
    );
  }
}

