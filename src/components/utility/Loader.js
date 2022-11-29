import React, { Component } from 'react';
import "./Loader.css";

export default class Loader extends Component {

  render() {

  	var type = this.props.type || "default";

  	var result = <span/>;

  	switch (type) {
  	case "connect":
  		result = <div className="connect-loader loader"><div className="lds-ripple"><div></div><div></div></div></div>;
  		break;
  	default: 
  		result = <div className="default-loader loader"><div className="lds-ring"><div></div><div></div><div></div><div></div></div></div>;
  		break;
  	}

    return result;
  }
}