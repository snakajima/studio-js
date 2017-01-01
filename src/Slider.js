//
// Copyright (c) 2016 Satoshi Nakajima (https://github.com/snakajima)
// License: The MIT License
//

import React, { Component } from 'react';

class Slider extends Component {
  constructor(props) {
    super();
  }
  render() {
    const cellWidth = Math.floor(this.props.cellSize * 2.0 / 3.0);
    const sections = (new Array(this.props.sections)).fill(0).map((_e, index) => {
      var className = (index===0) ? 'sliderCellFirst' : 'sliderCell';
      if (this.props.value >= (index+1)/this.props.sections) {
        className += ' sliderCellOn';
      }
      return <div className={className}
                  key={index}
                  style={{float:'left',width:cellWidth, height:this.props.cellSize}}></div>;
    });
    return (
      <div className='sliderFrame'>
        {sections}
      </div>
    );
  }
}

export default Slider;
