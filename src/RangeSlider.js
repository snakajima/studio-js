//
// Copyright (c) 2016 Satoshi Nakajima (https://github.com/snakajima)
// License: The MIT License
//

import React, { Component } from 'react';

class RangeSlider extends Component {
  constructor(props) {
    super();
    //this.onMouseOver = this.onMouseOver.bind(this);
    //this.onClick = this.onClick.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }
  
  onMouseOverWithValue(value) {
    return (e) => {
      if (this.dragging) {
        console.log('onMouseOver', this.start, value, this.props.name);
        this.end = value;
        const range = [Math.min(this.start, value), Math.max(this.start, value)];
        window.cursor.dispatch({type:'setSliderDragValue', value:range, name:this.props.name});
      }
    }
  }
  onMouseLeave(e) {
    if (this.dragging) {
      console.log('onMouseLeave');
      this.dragging = false;
      const range = [Math.min(this.start, this.end), Math.max(this.start, this.end)];
      window.cursor.dispatch({type:'setSliderValue', value:range, name:this.props.name});
      window.cursor.dispatch({type:'setSliderDragValue'});
      //window.cursor.dispatch({type:'setSliderDragValue'});
    }
  }
  onMouseDownWithValue(value) {
    return (e) => {
      console.log('onMouseDown', value);
      this.dragging = true;
      this.start = value;
      this.end = value;
      window.cursor.dispatch({type:'setSliderDragValue', value:[value, value], name:this.props.name});
    }
  }
  onMouseUpWithValue(value) {
    return (e) => {
      if (this.dragging) {
        console.log('onMouseUp', this.start, value, this.props.name);
        this.dragging = false;
        const range = [Math.min(this.start, value), Math.max(this.start, value)];
        window.cursor.dispatch({type:'setSliderValue', value:range, name:this.props.name});
        window.cursor.dispatch({type:'setSliderDragValue'});
      }
      //window.cursor.dispatch({type:'setRangeValue', value:value, name:this.props.name});
      //window.cursor.dispatch({type:'setRangeDragValue'});
    }
  }

  render() {
    this.cellWidth = Math.floor(this.props.cellSize * 2.0 / 3.0);
    const range = (this.props.slider && this.props.slider.name===this.props.name) ?
      this.props.slider.value : this.props.value;
    const cellStyle = {width:this.cellWidth, height:this.props.cellSize};
    const sections = (new Array(this.props.sections)).fill(0).map((_e, index) => {
      var className = (index===0) ? 'sliderCellFirst' : 'sliderCell';
      const value = (index+1)/this.props.sections;
      if (range[0] <= value && value <= range[1]) {
        className += ' sliderCellOn';
      }
      return <div className={className}
           onMouseDown={this.onMouseDownWithValue(value)}
           onMouseUp={this.onMouseUpWithValue(value)}
           onMouseOver={this.onMouseOverWithValue(value)}
                  key={index}
                  style={cellStyle}></div>;
    });
    return (
      <div style={{float:'left'}}>
      <div className='sliderFrame'
           onMouseLeave={this.onMouseLeave}
        >
        {sections}
      </div>
      </div>
    );
  }
}

export default RangeSlider;
