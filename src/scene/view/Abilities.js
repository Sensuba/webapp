import React, { Component } from 'react';
import './Abilities.css';
import Ability from '../../components/cards/Ability';

export default class Abilities extends Component {

  render () {

    let list = this.props.hero.model.abilities;
    let lv = this.props.hero.level;

    let usable = [
      this.props.hero.player.canUseSkill(0),
      this.props.hero.player.canLevelUp(),
      this.props.hero.player.canUseSkill(1)
    ]

    return (
      <div className="game-abilities">
      { lv > 1 ?
        <div className={"game-ability" + (usable[0] ? "" : " game-ability-locked")}
          onTouchStart={e => { if (this.props.hero.player.playing && usable[0]) this.props.onGrab({type: "skill", no:0, model: this.props.hero.skills[lv-2][0], element: list[lv === 3 ? 2 : 0]}); }}
          onClick={e => this.props.onSelect(e, list[lv === 3 ? 2 : 0])}>
          <Ability src={list[lv === 3 ? 2 : 0]}/>
        </div> : "" }
      { lv === 3 ? <div className="game-ability game-ability-aura" onClick={e => this.props.onSelect(e, list[4])}><Ability src={list[4]}/></div> : "" }
      { this.props.levelup && lv !== 3 ? <div className={"game-lv-up" + (usable[1] ? "" : " game-ability-locked")} onClick={usable[1] ? (e => this.props.levelup()) : null}>
          <div className="lv-up-img-wrapper"><img className="lv-up-img" alt="" src={ lv === 1 ? this.props.hero.model['img-lv2'] : this.props.hero.model['img-lvmax'] }/></div>
          <div className="lv-up-frame"/>
          <div className="card-mana">{ lv === 2 ? 5 : 1 }</div>
          <img className="card-manaball" alt="" src="/images/ballmana.png"/>
        </div> : "" }
      { lv > 1 ?
        <div
          className={"game-ability" + (usable[2] ? "" : " game-ability-locked")}
          onTouchStart={e => { if (this.props.hero.player.playing && usable[2]) this.props.onGrab({type: "skill", no:1, model: this.props.hero.skills[lv-2][1], element: list[lv === 3 ? 3 : 1]}); }}
          onClick={e => this.props.onSelect(e, list[lv === 3 ? 3 : 1])}>
          <Ability src={list[lv === 3 ? 3 : 1]}/>
        </div> : "" }
      </div>
    );
  }
}

