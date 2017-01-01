//
// Copyright (c) 2016 Satoshi Nakajima (https://github.com/snakajima)
// License: The MIT License
//

import React, { Component } from 'react';

class Slider extends Component {
  constructor(props) {
    super();
    //this.onMouseOver = this.onMouseOver.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }
  
  onMouseOverWithValue(value) {
    return (e) => {
      console.log('onMouseOver', value);
    }
  }
  onMouseLeave(e) {
    console.log('onMouseLeave');
  }
  onClick(e) {
    console.log('onClick');
  }

  render() {
    this.cellWidth = Math.floor(this.props.cellSize * 2.0 / 3.0);
    const sections = (new Array(this.props.sections)).fill(0).map((_e, index) => {
      var className = (index===0) ? 'sliderCellFirst' : 'sliderCell';
      const value = (index+1)/this.props.sections;
      if (this.props.value >= value) {
        className += ' sliderCellOn';
      }
      return <div className={className}
           onClick={this.onClick}
           onMouseOver={this.onMouseOverWithValue(value)}
           onMouseLeave={this.onMouseLeave}
                  key={index}
                  style={{float:'left',width:this.cellWidth, height:this.props.cellSize}}></div>;
    });
    return (
      <div className='sliderFrame'
        >
        {sections}
      </div>
    );
  }
}

export default Slider;
