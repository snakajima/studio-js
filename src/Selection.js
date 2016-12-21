//
// Copyright (c) 2016 Satoshi Nakajima (https://github.com/snakajima)
// License: The MIT License
//

import React, { Component } from 'react';
import DragContext from './DragContext';

class Selection extends Component {
  constructor(props) {
    super();
    this.onDragStart = this.onDragStart.bind(this);
    this.onDrag = this.onDrag.bind(this);
  }

  onDragStart(e,type) {
    DragContext.setContext({ pageIndex:this.props.pageIndex, id:this.props.element.id,
                             x:e.clientX, y:e.clientY });
  }
  onDrag(e) {
     console.log('onDrag');
  }
  
  render() {
    const scale = this.props.scale;
    const x = this.props.element.x * scale;
    const y = this.props.element.y * scale;
    const w = this.props.element.w * scale;
    const h = this.props.element.h * scale;
    return (
      <div style={{left:x, top:y, position:'absolute'}}>
        <div className='selection' style={{
            left:-1, top:-1,
            width:w-2, height:h-2,
            border:"2px solid #00BCD4"
          }}
          draggable={true}
          onDragStart={(e)=>this.onDragStart(e,0)}
        />
        <img className='handle' src='./scale_handle.png' alt=''
            style={{left:w/2-9, top:-9 }}
            draggable={true}
            onDragStart={(e)=>this.onDragStart(e,0)}
            onDrag={this.onDrag}
        />
        <img className='handle' src='./scale_handle.png' alt=''
            style={{left:w/2-9, top:h-9 }}
            draggable={true}
            onDragStart={(e)=>this.onDragStart(e,0)}
            onDrag={this.onDrag}
        />
        <img className='handle' src='./scale_handle.png' alt=''
            style={{left:-9, top:h/2-9 }}
            draggable={true}
            onDragStart={(e)=>this.onDragStart(e,0)}
            onDrag={this.onDrag}
        />
        <img className='handle' src='./scale_handle.png' alt=''
            style={{left:w-9, top:h/2-9 }}
            draggable={true}
            onDragStart={(e)=>this.onDragStart(e,0)}
            onDrag={this.onDrag}
        />
        <img className='handle' src='./scale_handle.png' alt=''
            style={{left:-9, top:-9 }}
            draggable={true}
            onDragStart={(e)=>this.onDragStart(e,0)}
            onDrag={this.onDrag}
        />
        <img className='handle' src='./scale_handle.png' alt=''
            style={{left:w-9, top:-9 }}
            draggable={true}
            onDragStart={(e)=>this.onDragStart(e,0)}
            onDrag={this.onDrag}
        />
        <img className='handle' src='./scale_handle.png' alt=''
            style={{left:-9, top:h-9 }}
            draggable={true}
            onDragStart={(e)=>this.onDragStart(e,0)}
            onDrag={this.onDrag}
        />
        <img className='handle' src='./scale_handle.png' alt=''
            style={{left:w-9, top:h-9 }}
            draggable={true}
            onDragStart={(e)=>this.onDragStart(e,0)}
            onDrag={this.onDrag}
        />
      </div>
    );
  }
}

export default Selection;
