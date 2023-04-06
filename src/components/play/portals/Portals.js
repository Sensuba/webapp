import React, { Component } from 'react';
import { Input, Label, Button, Tooltip } from 'reactstrap';
import './Portals.css';
import Nav from '../../nav/Nav';
import Back from '../../Back';
import Portal from '../../cards/Portal';
import Card from '../../cards/Card';
//import Hero from '../../cards/Hero';
import CardBox from '../../cards/CardBox';
import MainButton from '../../buttons/MainButton';
import Library from '../../../scene/utility/Library';
import SocketManager from '../../../SocketManager';
import Lightbox from '../../utility/Lightbox';
import StoryText from '../../text/StoryText';
import Loader from '../../utility/Loader';

import sorter from '../../cards/CollectionSorter';
import { read } from '../../../TextManager';

export default class Portals extends Component {

  state = {
    focus: null,
    action: null,
    collection: JSON.parse(localStorage.getItem('collection')),
    reward: [{}, {}],
    rewarding: false,
    exploration: JSON.parse(localStorage.getItem('user')).exploration
  }

  componentDidMount () {

    SocketManager.master.onCollectionUpdate = (collection, reward) => {
      if (reward && reward.length > 1) {
        this.setState({action: null, reward, rewarding: true});
      } else
        this.setState({action: null, collection});
    }
    SocketManager.master.onExplorePortal = (exploration) => this.setState({exploration});
    this.interval = setInterval(() => this.forceUpdate(), 30000);
  }

  componentWillUnmount () {

    delete SocketManager.master.onCollectionUpdate;
    delete SocketManager.master.onExplorePortal;
    clearInterval(this.interval);
  }

  render () {

    let portals = Object.values(Library.portals);
    // Temporary
    portals = portals.filter(p => p.key !== 16);
    let user = JSON.parse(localStorage.getItem('user'));

    let cards = [];
    if (this.state.portal) {
      Object.keys(this.state.portal.cards).forEach(rarity => this.state.portal.cards[rarity].forEach(key => cards.push(Object.assign({rarity}, Library.getCard(key)))));
      cards = sorter.sort(cards, 'type');
    }

    let timer = 0;
    if (this.state.exploration) {
      let duration = (new Date()) - (new Date(this.state.exploration.date)) + 2000;
      timer = Math.ceil((Library.portals[this.state.exploration.key].min * 60000 - duration)/60000);
    }

    let left = null, right = null;
    if (this.state.focus && !this.state.rewarding) {
      let index = cards.findIndex(card => card.key === this.state.focus.key);
      if (index >= 0) {
        if (index > 0)
          left = cards[index-1];
        if (index < cards.length-1)
          right = cards[index+1];
      }
    }

    return (
      <div className="main-page portals-page">
        <Lightbox className="explore-box small" open={this.state.action === "explore"} onClose={() => this.setState({action: null})}>
          <h1>{ read('menu/askconfirmationexplore') }</h1>
          <div className="options-warning">{ read('menu/explorewarning') }</div>
          <MainButton onClick={() => { SocketManager.master.portal("explore", this.state.portal.key); this.setState({action: null}); } }>{ read('menu/exploreportal') }</MainButton>
        </Lightbox>
        {
          this.state.action === "waiting" ?
          <div className="lightbox-container">
            <div className="lightbox-inner">
              <Loader/>
            </div>
          </div>
          : ""
        }
        <div className={"lightbox-reward lightbox-container" + (this.state.rewarding ? "" : " hidden-reward")}>
          <div className="lightbox-inner" onClick={() => this.setState({rewarding: false, collection: JSON.parse(localStorage.getItem('collection'))})}>
            <div className="reward-list">
            {
              this.state.reward.map((reward,i) => 
                reward.type === "card" ?
                <div key={i} onClick={e => { this.setState({focus: Library.getCard(reward.key)}); e.stopPropagation(); } } className="reward card-reward"><Card src={Library.getCard(reward.key)}/></div> :
                <div key={i} onClick={e => {} } className="reward shards-reward">
                  <div className="shards-reward-value">{ "+" + reward.value }</div>
                  <div className="shards-icon"/>
                </div>
              )
            }
            </div>
          </div>
        </div>
        {
          this.state.focus ?
          <div>
            <CardBox left={left ? () => this.setState({focus:left}) : undefined} right={right ? () => this.setState({focus:right}) : undefined} src={this.state.focus} open={true} onClose={() => this.setState({focus:null})}/>
            {
              this.state.collection.cards.includes(this.state.focus.key) || this.state.rewarding ? "" :
              <div className="portals-page-craftcard" onClick={() => { if (user.shards >= (this.state.portal.runes * (this.state.focus.rarity === "common" ? 1 : (this.state.focus.rarity === "uncommon" ? 2 : 4)))) { SocketManager.master.portal('craft', this.state.portal.key, this.state.focus.key); this.setState({action: "waiting"}); } } }>{ read('menu/craft') }<span className="cost"><div className="shards-icon"/>{ "" + (this.state.portal.runes * (this.state.focus.rarity === "common" ? 1 : (this.state.focus.rarity === "uncommon" ? 2 : 4)))}</span></div>
            }
          </div>
          : ""
        }
        <Nav/>
        <div className="main">
          <div className="portals-page-nav"></div>
          <div className="portals-page-search">
            <div className="portals-page-search-main">
              <div className="portals-page-search-tab">
                <div className="portals-page-search-main-label">{ read("menu/portals") }</div>
              </div>
              <div className="portals-page-search-tab">
                <div className="portals-page-search-main-label">{ read('menu/heroes') }</div>
              </div>
            </div>
            {

            }
            <div className={"portals-page-explore-tab" + (this.state.exploration && timer <= 0 ? " explore-ready" : "")} onClick={() => { if (this.state.exploration && timer <= 0) SocketManager.master.portal('complete'); else if (this.state.exploration) this.setState({portal: Library.portals[this.state.exploration.key]}) }}>
              <div className="portals-page-explore-portal">{ this.state.exploration ? Library.portals[this.state.exploration.key].name : read('menu/notexploring') }</div>
                <div className="portals-page-explore-timer">{ this.state.exploration ? 
                <span>{ timer > 0 ? (<span className="portal-timer-text">{ read('menu/exploretimeremaining') }&nbsp;</span>) : "" }<span className="portal-timer-count">{(timer < 60 ? (timer <= 0 ? read("menu/exploreready") : timer + read("menu/minute")) : Math.ceil(timer/60) + read("menu/hour"))}</span></span>
                
                 : "" }</div>
            </div>
          </div>
          <div className="portals-page-main">
            <div className="portal-list">
              {
                portals.map((portal, i) => <div key={i} className={"listed-portal" + (this.state.portal && this.state.portal.key === portal.key ? " selected-portal" : "")} onClick={() => {
                    if (this.state.portal && this.state.portal.key === portal.key) {
                    }
                    else {
                      this.setState({portal});
                    }
                  }
                }><Portal src={portal}/></div>)
              }
              </div>
              {
                this.state.portal ?
                <div className="portal-focus">
                  <div className="focused-portal">
                    <Portal src={this.state.portal}/>
                  </div>
                  <div className="portal-cards-text-short">{ read('menu/includescardsshort') }</div><div className="portal-cards-text-short">{ read('menu/includescardsshort') }</div>
                  <div className="portal-cards-text-long">{ read('menu/includescardslong') }</div>
                  <div className="portal-cards">
                  {
                    cards.slice(0, 5).map((card,i) => <div onClick={() => this.setState({focus: card})} key={card.key} className={"portal-card-wrapper" + (this.state.collection.cards.includes(card.key) ? " card-owned" : "")}><Card src={card}/></div>)
                  }
                  </div>
                  <div className="portal-cards">
                  {
                    cards.length > 5 ? cards.slice(Math.max(5, 1)).map((card,i) => <div onClick={() => this.setState({focus: card})} key={card.key} className={"portal-card-wrapper" + (this.state.collection.cards.includes(card.key) ? " card-owned" : "")}><Card src={card}/></div>) : ""
                  }
                  </div>
                  <div className="portal-name">{this.state.portal.name}</div>
                  <div className="portal-description">{this.state.portal.description}</div>
                  <div className="portal-focus-buttons">
                    <div className={"portal-focus-button" + (this.state.portal.runes > user.runes ? " locked" : "")} onClick={() => { if (this.state.portal.runes <= user.runes) { SocketManager.master.portal('conjure', this.state.portal.key); this.setState({action: "waiting"}); } } }>{ read('menu/conjureportal') }<span className="cost"><div className="runes-icon"/>{ "" + this.state.portal.runes}</span></div>
                    <div className={"portal-focus-button" + (this.state.exploration && this.state.exploration.key === this.state.portal.key ? " locked" : "")} onClick={() => { if (this.state.exploration && this.state.exploration.key !== this.state.portal.key) this.setState({action: "explore"}); else if (!this.state.exploration || this.state.exploration.key !== this.state.portal.key) SocketManager.master.portal('explore', this.state.portal.key) } }>{ read('menu/exploreportal') }<span className="cost"><div className="time-icon"/>{ "" + (this.state.portal.min < 60 ? this.state.portal.min + read("menu/minute") : (this.state.portal.min/60) + read("menu/hour"))}</span></div>
                  </div>
                </div>
                : <div className="portal-focus"><StoryText>{ read('messages/selectportal') }</StoryText></div>
              }
              
            </div>
          </div>
        <Back to="/play"/>
      </div>
    );
  }
}

