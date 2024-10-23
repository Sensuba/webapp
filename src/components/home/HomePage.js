import React, { Component } from 'react';
import './HomePage.css';
import Nav from '../Nav';

export default class HomePage extends Component {
  
  render() {
    return (
      <div>
        <Nav api={this.props.api} history={this.props.history}/>
      	<main>
          <div className="home-choicer">
            <div className="home-panel panel-left">
              <img className="home-panel-background" src="/img1.jpg" alt="bg"/>
              <div className="home-panel-filter"/>
              <div className="home-panel-text">
                <h3>Plongez dans la bataille</h3>
                <p>Une fois encore, les mondes convergent dans une bataille infernale ! Utilisez le pouvoir de vos cartes pour mener des batailles entre héros de tous temps et de tout univers. Jouez à Sensuba en ligne gratuitement pour profiter du duels épiques entre vos personnages d'animes préférés.</p>
                <button className="select-button" onClick={() => this.props.history.push("/play")}>Lancer une partie</button>
              </div>
            </div>
            <div className="home-panel panel-right">
              <img className="home-panel-background" src="/img2.jpg" alt="bg"/>
              <div className="home-panel-filter"/>
              <div className="home-panel-text">
                <h3>Comment jouer ?</h3>
                <p>Découvrez les règles de Sensuba à travers un tutoriel en plusieurs missions pour maîtriser les arcanes des cartes et battre tous vos amis.</p>
                <button className="select-button" onClick={() => this.props.history.push("/solo")}>Apprendre à jouer</button>
              </div>
            </div>
            <div className="home-panel panel-left">
              <img className="home-panel-background" src="/img3.jpg" alt="bg"/>
              <div className="home-panel-filter"/>
              <div className="home-panel-text">
                <h3>Une grande variété de cartes</h3>
                <p>Explorez la collection pour découvrir les 1300 cartes disponibles. Concevez les meilleures stratégies !</p>
                <button className="select-button" onClick={() => this.props.history.push("/cards")}>Voir la collection</button>
              </div>
            </div>
          </div>
      	</main>
      </div>
    );
  }
}