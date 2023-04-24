import React, { Component } from 'react';
import './Choosebox.css';
import Card from '../../components/cards/Card';

import { read } from '../../TextManager';

export default class Choosebox extends Component {

  render () {

    return (
      <div className="game-choosebox-wrapper">
        <div className="game-choosebox">
         <div className="choosebox-inner">
          {
            this.props.src.items.map((item, i) =>
              <div key={i} className="choosebox-item">
                <div className="choosebox-item-card" onClick={e => this.props.focus(item.type === "card" ? item.element.model : item.element)}><Card src={item.element}/></div>
                <div className="choosebox-item-select" onClick={e => this.props.choose(i)}><div className="choosebox-item-select-text">{ read('scene/selectchoosebox') }</div></div>
              </div>
            )
          }
          </div>
        </div>
      </div>
    );
  }
}

