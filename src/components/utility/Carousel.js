import React, { Component } from 'react';
import './Carousel.css';

export default class Carousel extends Component {

  constructor (props) {

    super(props)

    this.state = {
      selected: 0,
      adding: false
    }
  }

  render () {

    let getkey = k => k < 0 ? k + this.props.worlds.length : k % this.props.worlds.length;

    let portals = [];
    if (this.state.adding === 2)
      portals.push({world: this.props.worlds[getkey(this.state.selected-5)], key: getkey(this.state.selected-5), size: "smallest"});
    else portals.push({key:-5});
    if (this.state.adding)
      portals.push({world: this.props.worlds[getkey(this.state.selected-4)], key: getkey(this.state.selected-4), size: "smallest"});
    else portals.push({key:-6});
    portals.push({world: this.props.worlds[getkey(this.state.selected-3)], key: getkey(this.state.selected-3), size: "smallest"});
    portals.push({world: this.props.worlds[getkey(this.state.selected-2)], key: getkey(this.state.selected-2), size: "small"});
    portals.push({world: this.props.worlds[getkey(this.state.selected-1)], key: getkey(this.state.selected-1), size: "medium"});
    portals.push({world: this.props.worlds[this.state.selected], key: this.state.selected, size: "big"});
    portals.push({world: this.props.worlds[getkey(this.state.selected+1)], key: getkey(this.state.selected+1), size: "medium"});
    if (!this.state.adding || this.state.adding !== 2)
      portals.push({world: this.props.worlds[getkey(this.state.selected+2)], key: getkey(this.state.selected+2), size: "small"});
    else portals.push({key:-7, size: "small"});
    if (!this.state.adding)
      portals.push({world: this.props.worlds[getkey(this.state.selected+3)], key: getkey(this.state.selected+3), size: "smallest"});
    else portals.push({key:-8});
    portals.push({key:-9});
    portals.push({key:-10});

    return (
      <div className="world-carousel">
        {
          portals.map(p =>
          <div key={p.key} className={p.size + "-portal portal " + p.key} onClick={ () => {
            let adding = false;
            if (p.key === getkey(this.state.selected-1)) adding = 1;
            if (p.key === getkey(this.state.selected-2)) adding = 2;
            if (adding)
              this.setState({adding}, () => setTimeout(() => this.setState({selected: p.key, adding: false}), 1));
            else this.setState({selected: p.key});
            this.props.onSelect(p.world);
          } }>
          { p.world ?
            <img alt="" src={p.world.background}/>
          : "" }
          { p.size === "big" ?
          <div className="portal-fog">
          <div className="circle"></div>
            <div className="circle2"></div>

            <svg>
              <filter id="wave">
                <feTurbulence x="0" y="0" baseFrequency="0.009" numOctaves="5" seed="2">
                  <animate attributeName="baseFrequency" dur="30s" values="0.01;0.005;0.02" repeatCount="indefinite" />
                </feTurbulence>
                <feDisplacementMap in="SourceGraphic" scale="30" />
              </filter>
            </svg></div> : "" }
          <div className="portal-dark-filter"/>
          </div>)
        }
      </div>
    );
  }
}

