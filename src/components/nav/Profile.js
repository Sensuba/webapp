import React, { Component } from 'react';
import './Profile.css';
import Lightbox from '../utility/Lightbox';

import { read } from '../../TextManager';

export default class Profile extends Component {

  state = {
    status: null
  }

  render () {

    let user = null; //localStorage.getItem('user');

    return (
        <div className={"nav-item nav-options nav-profile"}>
      {
        user ?
        <div>
          <Lightbox className="small" open={this.state.status === "profile"} onClose={() => this.setState({status: null})}>
            <div className="options-box">
              <h1>{ read('menu/profile') }</h1>
            </div>
          </Lightbox>
          <div onClick={() => this.setState({status: "profile"})} className="options-icon profile-icon"/>
          </div>
        : "" 
      }
        </div>
    );
  }
}

