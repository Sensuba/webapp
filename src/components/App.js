import './App.css';
import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from './home/Home';
import Error from './home/Error';
import Loading from './home/Loading';
import Play from './play/Play';
import Story from './play/story/Story';
import Game from './game/Game';
import Dwelling from './play/dwelling/Dwelling';
import Cards from './play/cards/Cards';

import SocketManager from '../SocketManager';

import { read, getLanguage, setLanguage } from '../TextManager';

const offlineMode = false;

export default class App extends Component {

  constructor (props) {

    super(props);
    let io = SocketManager.master;
    if (!offlineMode) {
      io.start();
      io.onStatusChange = status => {

        if (!this.state.connected && status === 'connected')
          this.setState({connected: true});
      }
    }

    setTimeout(() => this.setState({started: true}), 300)

    this.state = {
      connected: false
    };

    switch (window.location.pathname) {
    case '/en': setLanguage('en'); break;
    case '/fr': setLanguage('fr'); break;
    default: break;
    }
  }

  render () {

    if (!this.state.started)
      return <div className="app"/>;

    if (!this.state.connected && !offlineMode)
      return <div className="app"><Error>{ read('messages/connecterror') }</Error></div>;

    return (
      <div className="app">
        <Router>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/play" element={<Dynamo><Play/></Dynamo>}/>
            <Route path="/story" element={<Dynamo><Story/></Dynamo>}/>
            <Route path="/game" element={<Dynamo><Game/></Dynamo>}/>
            <Route path="/dwelling" element={<Dynamo><Dwelling/></Dynamo>}/>
            <Route path="/cards" element={<Dynamo><Cards/></Dynamo>}/>
            <Route
                path="*"
                element={<Navigate to="/" replace />}
            />
          </Routes>
        </Router>
      </div>
    );
  }
}

var checkLibraryVersion = false;

class Dynamo extends Component {

  constructor (props) {

    super(props);
    setTimeout(() => {
      if (!this.loaded)
        this.showLoadingScreenFade = true;
    }, 500)
    if (!offlineMode && !this.libraryLoaded) {
      let io = SocketManager.master;
      let updatelibrary = () => {
        io.loadLibrary(getLanguage());
        io.onUpdateLibrary = (n, total) => {
          this.setState({loading:n/total});
          if (n >= total) {
            if (this.showLoadingScreenFade) {
              document.getElementsByClassName("main-page")[0].classList.add("fade-out");
              setTimeout(() => this.setState({loaded:true}), 500);
              checkLibraryVersion = true;
            } else this.setState({loaded:true});
          }
        }
      }
      if (!checkLibraryVersion && this.hasLibraryData)
        io.getLibraryVersion(v => {
          if (v === localStorage.getItem("library.version")) {
            checkLibraryVersion = true;
            this.setState({loaded:true});
          }
          else updatelibrary();
        })
      else updatelibrary();
    }

    this.state = {
      loading: 0,
      loaded: this.libraryLoaded
    }
  }

  get libraryLoaded () {

    return checkLibraryVersion && this.hasLibraryData;
  }

  get hasLibraryData () {

    return localStorage.getItem('library.cards') && localStorage.getItem('library.terrains') && localStorage.getItem('library.structures');
  }

  render () {

    if (!this.state.loaded && offlineMode)
      return <Error>{ read('messages/libraryunloaded') }</Error>;
    if (!this.state.loaded)
      return <Loading value={this.state.loading}>{ read('menu/loading') }</Loading>;

    return this.props.children;
  }
}

