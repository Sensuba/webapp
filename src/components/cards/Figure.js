import React, { Component } from 'react';

export default class Figure extends Component {

	constructor (props) {

		super (props);
		this.id = this.props.id || (this.props.src.idCardmodel + "." + Math.floor(Math.random() * 100000));
	}

  render() {

  	var src = this.props.src;

  	var capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);

  	var rarityclass = (rarity, edition) => {

  		switch (rarity) {
  		case 1: return "common-card";
  		case 2: return "uncommon-card";
  		case 3: return "rare-card";
  		default: return edition === 1 ? "basic-card" : "";
  		}
  	}

    var archetypeTranslation = archetype => {

      switch (archetype) {
      case "beast": return "bête";
      case "demon": return "démon";
      default: return archetype;
      }
    }

  	var ct = "Figure";
  	if (src.archetypes && src.archetypes.length > 0) {
  		ct += ": " + capitalize(archetypeTranslation(src.archetypes[0]));
  		if (src.archetypes && src.archetypes.length > 1)
  			ct += ", " + capitalize(archetypeTranslation(src.archetypes[1]))
  	}

  	let poisoned = src.hasOwnProperty('poisondmg') && src.poisondmg;
  	let armored = src.armor || 0;
  	
    return (
      <div id={this.id}
      className={"sensuba-card sensuba-figure " + this.props.classColor + " " + rarityclass(src.rarity, src.idEdition) + " " + (this.props.holographic ? "sensuba-card-holographic " : " ") + this.props.className}
      onMouseMove={e => {
      		if (this.props.holographic) {
      			var el = document.getElementById(this.id);
			  var offset = el.offsetLeft;
		        if (el.offsetParent)
		          offset += el.offsetParent.offsetLeft;
		        var width = el.clientWidth;
		        var value = (e.clientX - offset) / width;
			  const percentage = value * 100;
	  		  document.getElementById(this.id + "-filter").style.backgroundPosition = percentage + "%";
	  		  document.getElementById(this.id + "-inner").style.transform = "skew(0, " + (value * 1.25 - 0.625) + "deg)";
	  		  document.getElementById(this.id + "-img").style.left = (-1.75 - value * 1.5) + "%";
	  		}
		}}
      	>
      	<div id={this.id + "-inner"} className="sensuba-card-inner">
      	<div className="sensuba-card-placeholder">
	    		<div className="sensuba-card-rune"/>
      	</div>
		<img id={this.id + "-img"} className="sensuba-card-bg" src={src.imgLink} alt=""/>
	    <div className="sensuba-card-header">
	    	<div className={"sensuba-card-mana" + (src.mana < src.originalMana ? " sensuba-card-param-bonus" : (src.mana > src.originalMana ? " sensuba-card-param-malus" : ""))}>{src.mana}</div>
	        <div className={"sensuba-card-title" +
	        	(src.nameCard.length >= 25 ?
	        		(src.nameCard.length >= 29 ?
		        		(src.nameCard.length >= 32 ? " sensuba-card-very-very-long-title" : " sensuba-card-very-long-title")
		        		: " sensuba-card-long-title"
		        	)
	        		: ""
	        	)}>
	        	{src.nameCard}
	        </div>
	    </div>
	    <div className="sensuba-card-rune"/>
	    { src.illustrator ? <div className="sensuba-card-illustrator">Illus: {src.illustrator}</div> : <span/> }
	    <div className="sensuba-card-body">
	    	<div className="sensuba-card-body-header">
	        	<span className="sensuba-card-type">{ct}</span>
	        	<span className="sensuba-card-anime">{src.anime}</span>
	        </div>
	        <div className="sensuba-card-body-main">
	        	<div className="sensuba-card-effect" style={{fontSize: (src.fontSize || 1.3)/2 + 'em'}} dangerouslySetInnerHTML={{__html: src.htmlDescription}}/>
	        	<div className="sensuba-card-flavour">{src.flavourText || ""}</div>
	        	{ src.idEdition > 1 ? <div className={"sensuba-card-edition sensuba-card-edition-" + src.idEdition}/> : <span/> }
	        </div>
	    </div>
		<div className="sensuba-card-footer">
		  <div className="sensuba-card-param sensuba-card-param-atk">
		  	<div className="sensuba-card-param-name">ATK</div>
		   	<div className={"sensuba-card-param-value" + (src.atk < src.originalAtk ? " sensuba-card-param-malus" : (src.atk > src.originalAtk ? " sensuba-card-param-bonus" : ""))}>{src.atk}</div>
		  </div>
		  <span className="sensuba-card-param-separator">/</span>
		  <div className={"sensuba-card-param sensuba-card-param-hp" + (poisoned || armored ? " sensuba-card-althp" : "") + (poisoned && armored ? " sensuba-card-althp2" : "")}>
		    <div className="sensuba-card-param-name">PV</div>
	   	    <div className={"sensuba-card-param-value" + (src.hasOwnProperty('chp') && src.chp < src.hp ? " sensuba-card-param-malus" : (src.hp > src.originalHp ? " sensuba-card-param-bonus" : ""))}>{src.chp || src.hp}</div>
		  </div>
		  {
		  	poisoned ?
			<div className={"sensuba-card-param sensuba-card-param-poison" + (armored ? " sensuba-card-altpa" : "")}>
		    <div className="sensuba-card-param-name">PSN</div>
		      <div className="sensuba-card-param-value">{src.poisondmg}</div>
			</div> : <span/>
		  }
		  {
		  	armored ?
			<div className={"sensuba-card-param sensuba-card-param-armor" + (poisoned ? " sensuba-card-altpa" : "")}>
		    <div className="sensuba-card-param-name">ARM</div>
		      <div className="sensuba-card-param-value">{armored}</div>
			</div> : <span/>
		  }
		</div>
		<div className={"sensuba-card-range" + (src.range < src.originalRange ? " sensuba-card-param-malus" : (src.range > src.originalRange ? " sensuba-card-param-bonus" : ""))}>
		  <div className="sensuba-card-range-arrow"/>
		  { src.range > 1 ? <div className="sensuba-card-range-arrow sensuba-card-range-arrow-2"/> : <span/> }
		  { src.range > 2 ? <div className="sensuba-card-range-arrow sensuba-card-range-arrow-3"/> : <span/> }
		</div>
	    { src.overload && src.overload > 0 ? <div className={"sensuba-card-overload" + (src.ol && src.ol > src.overload ? " sensuba-card-overload-limit-break" : "")}>{src.overload}</div> : <span/> }
	  	<div className="sensuba-card-frame">
	    	<div className="sensuba-frame-icon"/>
	    	<div className="sensuba-card-inner-frame"/>
	    </div>
	    <div id={this.id + "-filter"} className="sensuba-card-filter"/>
	    </div>
	  </div>
    );
  }
}