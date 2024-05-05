import React, { Component } from 'react';

export default class Secret extends Component {

	constructor (props) {

		super (props);
		this.id = this.props.id || (this.props.src.idCardmodel + "." + Math.floor(Math.random() * 100000));
	}

  render() {

  	var src = this.props.src;

  	var rarityclass = (rarity, edition) => {

  		switch (rarity) {
  		case 1: return "common-card";
  		case 2: return "uncommon-card";
  		case 3: return "rare-card";
  		default: return edition === 1 ? "basic-card" : "";
  		}
  	}
  	
    return (
      <div id={this.id}
      className={"sensuba-card sensuba-secret " + this.props.classColor + " " + rarityclass(src.rarity, src.idEdition) + " " + (this.props.holographic ? "sensuba-card-holographic " : " ") + this.props.className}
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
	        	<span className="sensuba-card-type">Secret</span>
	        	<span className="sensuba-card-anime">{src.anime}</span>
	        </div>
	        <div className="sensuba-card-body-main">
	        	<div className="sensuba-card-effect" style={{fontSize: (src.fontSize || 1.3)/2 + 'em'}} dangerouslySetInnerHTML={{__html: src.htmlDescription}}/>
	        	<div className="sensuba-card-flavour">{src.flavourText || ""}</div>
	        	{ src.idEdition > 1 ? <div className={"sensuba-card-edition sensuba-card-edition-" + src.idEdition}/> : <span/> }
	        </div>
	    </div>
	    <span className="sensuba-card-specialtype-icon">?</span>
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