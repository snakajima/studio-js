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
    console.log("Slider:sections", this.props.cellSize, this.props.sections, cellWidth);
    const sections = (new Array(this.props.sections)).fill(0).map((_e, index) => {
      console.log("Slider:index", _e, index);
      return <div className={(index===0) ? 'sliderCellFirst' : 'sliderCell'}
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
