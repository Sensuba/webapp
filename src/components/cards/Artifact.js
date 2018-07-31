import React, { Component } from 'react';

export default class Artifact extends Component {

  render() {

  	var capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);
  	
    return (
      <div id={this.props.id} className={"sensuba-card sensuba-artifact " + this.props.classColor}>
		<img crossOrigin="Anonymous" className="sensuba-card-bg" src={this.props.src.imgLink} alt={this.props.src.nameCard}/>
	    <div className="sensuba-card-header">
	    	<div className="sensuba-card-mana">{this.props.src.mana}</div>
	        <div className={"sensuba-card-title" + (this.props.src.nameCard.length >= 25 ? " sensuba-card-long-title" : "")}>{this.props.src.nameCard}</div>
	    </div>
	    <div className="sensuba-card-body">
	    	<div className="sensuba-card-body-header">
	        	<span className="sensuba-card-type">{capitalize(this.props.src.cardType)}</span>
	        	<span className="sensuba-card-anime">{this.props.src.anime}</span>
	        </div>
	        <div className="sensuba-card-body-main">
	        	<div className="sensuba-card-effect" style={{fontSize: (this.props.src.fontSize || 1.3)/2 + 'em'}} dangerouslySetInnerHTML={{__html: this.props.src.htmlDescription}}/>
	        	<div className="sensuba-card-flavour">{this.props.src.flavourText}</div>
	        </div>
	    </div>
		<div className="sensuba-card-footer">
		  <div className="sensuba-card-param sensuba-card-param-hp">
		    <div className="sensuba-card-param-name">DUR</div>
	   	    <div className="sensuba-card-param-value">{this.props.src.hp}</div>
		  </div>
		</div>
	    { this.props.src.overload && this.props.src.overload > 0 ? <div className="sensuba-card-overload">{this.props.src.overload}</div> : <span/> }
	    <div className="sensuba-card-frame">
	    	<div className="sensuba-frame-icon"/>
	    	<div className="sensuba-card-inner-frame"/>
	    </div>
	  </div>
    );
  }
}