import React, { Component } from 'react';
import "./Slider.css";

export default class Slider extends Component {

  constructor (props) {

    super(props);
    this.ref = React.createRef();
    var def = this.props.defaultValue;
    if (!def && def !== 0)
      def = 1;
    this.state = { value: def }
  }

  render() {

    return (
      <div ref={this.ref} className="sensuba-slider" onClick={e => {
        var offset = this.ref.current.offsetLeft;
        if (this.ref.current.offsetParent)
          offset += this.ref.current.offsetParent.offsetLeft;
        var width = this.ref.current.clientWidth;
        var value = (e.clientX - offset) / width;
        value = Math.max(value-0.08, 0);
        value = Math.min(value/(1-2*0.08), 1);
        this.setState({ value });
        if (this.props.onChange)
          this.props.onChange(value);
      }}>
        <div className="sensuba-slider-bar"/>
        <div style={{left: (0.225 + this.state.value*5) + "em"}} className="sensuba-slider-pin"/>
      </div>
    );
  }
}