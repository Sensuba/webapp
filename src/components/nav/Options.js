import React, { Component } from 'react';
import './Options.css';
import Lightbox from '../utility/Lightbox';
import MainButton from '../buttons/MainButton';

import { read, getLanguage, setLanguage } from '../../TextManager';
import { getVolume, setVolume } from '../../SoundManager';

export default class Options extends Component {

  state = {
    status: null
  }

  changeLanguage (language) {

    if (getLanguage() !== language) {
      setLanguage(language);
      window.location.reload(false);
    }
  }

  render () {

    let language = getLanguage();

    let music = getVolume('music') * 10;
    let sfx = getVolume('sfx') * 10;

    return (
      <div className="nav-item nav-options">
        <Lightbox className="small" open={this.state.status === "options"} onClose={() => this.setState({status: null})}>
          <div className="options-box">
            <h1>{ read('menu/options') }</h1>
            <div className="options-row">
              <div className="options-param">{ read('menu/music') }</div>
              <div className="options-value">{[...Array(11).keys()].map(i => <div key={i} onClick={() => { setVolume(i/10, 'music'); this.forceUpdate(); }} className={"options-audio-tick" + (music >= i ? " audio-tick-active" : "")}/>)}</div>
            </div>
            <div className="options-row">
              <div className="options-param">{ read('menu/sfx') }</div>
              <div className="options-value">{[...Array(11).keys()].map(i => <div key={i} onClick={() => { setVolume(i/10, 'sfx'); this.forceUpdate(); }} className={"options-audio-tick" + (sfx >= i ? " audio-tick-active" : "")}/>)}</div>
            </div>
            <div className="options-row">
              <div className="options-param">{ read('menu/language') }</div>
              <div className="options-value">{ read('language') + " /" }&nbsp;<span onClick={() => this.setState({status: "language"})} className="options-button">{ read('menu/changelanguage') }</span></div>
            </div>
            { this.props.concede ? <div className="concede-button">
              <MainButton onClick={() => { this.setState({status: null}); this.props.concede(); }} color="red">{ read('menu/concede') }</MainButton>
            </div> : "" }
          </div>
        </Lightbox>
        <Lightbox open={this.state.status === "language"} onClose={() => this.setState({status: null})}>
          <div className="options-box">
            <h1>{ read('menu/language') }</h1>
            <div className="options-warning">{ read('menu/languagewarning') }</div>
            <div className="options-row">
              <div onClick={() => this.changeLanguage("en")} className={"options-language" + (language === "en" ? " options-language-current" : "")}>{ "English" }</div>
            </div>
            <div className="options-row">
              <div onClick={() => this.changeLanguage("fr")} className={"options-language" + (language === "fr" ? " options-language-current" : "")}>{ "Français" }</div>
            </div>
            <div className="options-row">
              <div onClick={() => this.setState({status: "options"})} className="options-back">{ read('menu/back') }</div>
            </div>
          </div>
        </Lightbox>
        <div onClick={() => this.setState({status: "options"})} className="options-icon"/>
      </div>
    );
  }
}

