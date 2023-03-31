import React, { Component } from 'react';
import './Portal.css';
import Library from '../../scene/utility/Library';

export default class Portal extends Component {

	render () {

    	let portal = this.props.src;

		return(
			<div className={"sensuba-portal no-select "}>
				<div className="no-select portal-frame"/>
				<div className="inside-portal-frame">
				<div className="portal-image-wrapper">
					<img alt={portal.name} src={portal.img}/>
				</div>
				<div className="portal-name">{portal.name}</div>

				{  this.props.animate ?
          <div className="portal-fog">
          <div className="circle"></div>
            <div className="circle2"></div>

            <svg>
              <filter id="wave">
                <feTurbulence x="0" y="0" baseFrequency="0.009" numOctaves="5" seed="2">
                  <animate attributeName="baseFrequency" dur="30s" values="0.01;0.005;0.02" repeatCount="indefinite" />
                </feTurbulence>
                <feDisplacementMap in="SourceGraphic" scale="30" />
              </filter>
            </svg>
            </div> : ""
          }
          <div className="portal-dark-filter"/>

          </div>


			</div>
		);
	}
}