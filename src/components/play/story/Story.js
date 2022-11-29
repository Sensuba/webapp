import React, { Component } from 'react';
import './Story.css';
import Nav from '../../nav/Nav';
import Carousel from '../../utility/Carousel';
import MainButton from '../../buttons/MainButton';
import Back from '../../Back';

import { read } from '../../../TextManager';

export default class Story extends Component {

  worlds = [{name: 'Anthales', description: 'A world filled with verdant plains as far as the eye can see. A peaceful start to a great journey.', background: '/images/channel.png'}, {background: '/images/skytower.png'}, {background: '/images/star.png'}, 4, 5, {background: '/images/tree.png'}, {background: '/images/colors.png'}]

  constructor (props) {

    super(props)

    this.state = {
      selected: this.worlds[0]
    }
  }

  render () {

    return (
      <div className="main-page story-page">
        <Nav/>
        <div className="main">
          <div className="world-info">
            <h2>{ this.state.selected.name }</h2>
            <p>{ this.state.selected.description }</p>
          </div>
          <div className="world-choser">
            <div className="worlds">
              <Carousel worlds={this.worlds} onSelect={w => this.setState({selected: w})}/>
            </div>
            <div className="enter-world">
              <MainButton to="/game">{ read('nav/enter') }</MainButton>
            </div>
          </div>
        </div>
        <Back to="/play"/>
      </div>
    );
  }
}

