//
// Copyright (c) 2016 Satoshi Nakajima (https://github.com/snakajima)
// License: The MIT License
//

import React, { Component } from 'react';
import DragContext from './DragContext';

class Element extends Component {
  constructor(props) {
    super();
    this.onDragStart = this.onDragStart.bind(this);
    this.onClick = this.onClick.bind(this);
  }
  
  onDragStart(e) {
    DragContext.setContext({ pageIndex:this.props.pageIndex, id:this.props.element.id,
                             x:e.clientX, y:e.clientY });
  }
    
  onClick(e) {
    if (this.props.main) {
      console.log("Element.onClick:" + this.props.element.id);
      e.stopPropagation();
    }
  }
  
  render() {
    const scale = this.props.scale;
    return (
      <div className='canvasElement' style={{
          left:this.props.element.x * scale, top:this.props.element.y * scale,
          width:this.props.element.w * scale, height:this.props.element.h * scale,
          background:this.props.element.bc
        }}
        draggable={true}
        onDragStart={this.onDragStart}
        onClick={this.onClick}
      >
      {
        (typeof this.props.element.img === 'string') ?
            <img className='canvasImage' alt='' src={this.props.element.img}/>: ""
      }
      </div>
    );
  }
}

export default Element;
