import React, { Component } from 'react';
import './Logs.css';
import Lightbox from '../components/utility/Lightbox';

import { read } from '../TextManager';

export default class Logs extends Component {

  state = {
    open: false
  }

  compute (n) {

    let log = { n }

    switch (n.type) {
    case "startup": {
      log.main = true;
      log.text = n.data[0].no === parseInt(this.props.player.id.no, 10) ? read('logs/you' + n.type) : read('logs/enemy' + n.type);
      break;
    }
    case "endturn": {
      log.text = n.data[0].no === parseInt(this.props.player.id.no, 10) ? read('logs/you' + n.type) : read('logs/enemy' + n.type);
      break;
    }
    case "damage":
    case "heal":
    case "listener":
    case "destroy":
    case "summon":
    case "silence":
    {
      let card = this.props.model.find(n.data[0]);
      log.text = card.player === this.props.player ? read('logs/you' + n.type + (card.isHero ? 'hero' : '')) : read('logs/enemy' + n.type + (card.isHero ? 'hero' : ''));
      log.small = true;
      break;
    }
    case "burn":
    {
      let card = this.props.model.find(n.data[1]);
      log.text = card.player === this.props.player ? read('logs/you' + n.type + (card.isHero ? 'hero' : '')) : read('logs/enemy' + n.type + (card.isHero ? 'hero' : ''));
      log.small = true;
      break;
    }
    case "leveluptrigger.before":
    case "skilltrigger.before":
    case "attacktrigger.before":
    case "movetrigger.before":
    case "playcard.before": {
      log.text = n.data[0].no === parseInt(this.props.player.id.no, 10) ? read('logs/you' + n.type.slice(0, -7)) : read('logs/enemy' + n.type.slice(0, -7));
      break;
    }
    case "attack":
    case "leveluptrigger":
    case "skilltrigger":
    case "attacktrigger":
    case "movetrigger":
    case "playcard": {
      break;
    }
    default: log.text = read('logs/' + n.type);
    }

    return log;
  }

  renderLog (log) {

    let text = log.text;
    let splits = [];
    // eslint-disable-next-line
    let texts = text.split(/\[[^\[]+\]|\{[^\{]+\}|\n/);
    // eslint-disable-next-line
    let matches = text.match(/\[[^\[]+\]|\{[^\{]+\}|\n/g);
    if (matches)
      matches.forEach((match,i) => {
        let el = match.slice(1, -1);
        splits.push(<span key={i+"a"}>{ texts[i] }</span>);
        if (match[0] === '{') {
          if (el === "skill") {
            let player = this.props.model.find(log.n.data[0]);
            let skill = player.hero.model.abilities[(log.n.data[3]-2)*2+log.n.data[1]];
            splits.push(<span onClick={() => this.props.focus(skill, player.hero)} key={i} className="token" id={'effect-' + i}>{ skill.name }</span>);
          } else if (isNaN(log.n.data[el])) {
            let data = this.props.model.find(log.n.data[el]);
            switch (log.n.data[el].type) {
            case "card": {
              splits.push(<span onClick={() => this.props.focus(data.model)} key={i} className="token" id={'effect-' + i}>{ data.model.name }</span>);
              break;
            }
            case "tile": {
              splits.push(<span key={i} id={'effect-' + i}>{ data.x+1 }</span>);
              break;
            }
            default: break;
            } 
          } else {
            splits.push(<span key={i} id={'effect-' + i}>{ log.n.data[el] }</span>);
          }
        } else if (match[0] === '[') {
          //splits.push(<span key={i} className={"keyword " + (el.startsWith("half") || el === "volatile" ? "soft" : "")} id={'effect-' + i} onClick={() => this.toggleTooltip(i)}>{keywordIcons.includes(el) ? <img className="keyword-icon" src={"/images/icons/" + el + ".png"} alt=""/> : ""}{read('keywords/' + el)}</span>);
          //splits.push(<Tooltip key={i+"t"} className="tooltip" placement="top" isOpen={this.state.tooltip === i} target={"effect-" + i} toggle={() => this.toggleTooltip(i)}>{ read('keywords/description/' + el) }</Tooltip>);
        } else if (match[0] === '\n') {
          splits.push(<br key={i}/>);
        }
      });
    splits.push(<span key={"end"}>{ texts[texts.length-1] }</span>);
    return splits;
  }
	
  render () {

    return (
      <div className="nav-item nav-logs">
        <Lightbox open={this.state.open === true} onClose={() => this.setState({open: false})}>
          <div className="logs-box">
            <h1>{ read('scene/logs') }</h1>
            {
              this.state.open ?
              <div className="logs-list">
              {
                this.props.src.map(n => this.compute(n)).filter(log => log.text !== undefined).map((log, i) => <div key={i} className={"logs-log game-effect" + (log.small ? " small-log" : "") + (log.main ? " main-log" : "")}>{this.renderLog(log)}</div>)
              }
              </div> : ""
            }
          </div>
        </Lightbox>
        <div onClick={() => this.setState({open: true})} className="logs-icon"/>
      </div>
    );
  }
}