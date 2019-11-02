import React, { Component } from 'react';
import Area from './Area';
import Hand from './Hand';
import Deck from './Deck';
import Field from './Field';
import GemPool from './GemPool';
import Row from './Row';
import Tile from './Tile';
import Court from './Court';
import Gauge from '../UI/Gauge';
import EndTurn from '../UI/EndTurn';

export default class GameBoard extends Component {

  render () {

  	var master = this.props.master;
  	var no = master.no || 0;

  	var model = this.props.model;

    return (
    	<div className="sensuba-gameboard" onClick={master.manager ? () => master.manager.unselect() : () => {}}>
    	<div className="sensuba-board">
    	<Hand model={model.areas[1-no].hand} master={master}/>
	    	<Area model={model.areas[1-no]} master={master}>
		    	<Field model={model.areas[1-no].field} master={master}>
		    		<Row>
		    			<Tile model={model.areas[1-no].field.tiles[4]} master={master}/>
		    			<Tile model={model.areas[1-no].field.tiles[5]} master={master}/>
		    			<Tile model={model.areas[1-no].field.tiles[6]} master={master}/>
		    			<Tile model={model.areas[1-no].field.tiles[7]} master={master}/>
		    			<Tile model={model.areas[1-no].field.tiles[8]} master={master}/>
		    		</Row>
		    		<Row>
		    			<Tile model={model.areas[1-no].field.tiles[0]} master={master}/>
		    			<Tile model={model.areas[1-no].field.tiles[1]} master={master}/>
		    			<Tile model={model.areas[1-no].field.tiles[2]} master={master}/>
		    			<Tile model={model.areas[1-no].field.tiles[3]} master={master}/>
		    		</Row>
		    	</Field>
		    	<div className="sensuba-deck-wrapper">
	    			<Deck model={model.areas[1-no].deck} master={master}/>
	    		</div>
	    		<GemPool model={model.areas[1-no].manapool} master={master}/>
		    	<Court model={model.areas[1-no].court} master={master}/>
	    	</Area>
	    	<div className="sensuba-gauge-wrapper">
	    		<Gauge color="red" value={(model.areas[no].hero ? model.areas[no].hero.chp : 0) || 0} max={model.areas[no].hero ? model.areas[no].hero.hp : 0}/>
	    		<Gauge inverted color="red" value={(model.areas[1-no].hero ? model.areas[1-no].hero.chp : 0) || 0} max={model.areas[1-no].hero ? model.areas[1-no].hero.hp : 0}/>
	    		<Gauge color="dodgerblue" value={model.areas[no].manapool.mana + model.areas[no].manapool.extramana} max={model.areas[no].manapool.maxMana}/>
	    		<Gauge inverted color="dodgerblue" value={model.areas[1-no].manapool.mana + model.areas[1-no].manapool.extramana} max={model.areas[1-no].manapool.maxMana}/>
	    	</div>
	    	<div className={"sensuba-end-turn-wrapper " + (master.manager ? "" : "hidden")}>
	    		<EndTurn locked={!master.isPlaying} endTurn={() => master.manager.endTurn()}/>
	    	</div>
	    	<Area model={model.areas[no]} master={master}>
		    	<Court model={model.areas[no].court} master={master}/>
		    	<Field model={model.areas[no].field} master={master}>
		    		<Row>
		    			<Tile model={model.areas[no].field.tiles[0]} master={master}/>
		    			<Tile model={model.areas[no].field.tiles[1]} master={master}/>
		    			<Tile model={model.areas[no].field.tiles[2]} master={master}/>
		    			<Tile model={model.areas[no].field.tiles[3]} master={master}/>
		    		</Row>
		    		<Row>
		    			<Tile model={model.areas[no].field.tiles[4]} master={master}/>
		    			<Tile model={model.areas[no].field.tiles[5]} master={master}/>
		    			<Tile model={model.areas[no].field.tiles[6]} master={master}/>
		    			<Tile model={model.areas[no].field.tiles[7]} master={master}/>
		    			<Tile model={model.areas[no].field.tiles[8]} master={master}/>
		    		</Row>
		    	</Field>
		    	<div className="sensuba-deck-wrapper">
	    			<Deck model={model.areas[no].deck} master={master}/>
	    		</div>
	    		<GemPool model={model.areas[no].manapool} master={master}/>
	    	</Area>
    	<Hand model={model.areas[no].hand} master={master}/>
    	</div>
      </div>
    )
  }
}