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

  onDragStart(e,handle) {
    const element = this.props.element;
    const scale = this.props.scale;
    DragContext.setContext({
      pageIndex:this.props.pageIndex,
      id:element.id, handle:handle,
      index:this.props.index,
      params:{},
      width:scale * element.w,
      height:scale * element.h,
      x:e.clientX, y:e.clientY });
  }
  onDrag(e) {
    var context = DragContext.getContext();
    //const element = context.element;
    //console.log('onDrag', context.handle, element.x, element.w);
    if (context.handle === 'turn') {
      const dx = e.clientX - context.x;
      const dy = e.clientY - context.y - context.height/2 - 20;
      const r = Math.round(Math.atan2(dy,dx) * 180 / Math.PI + 360 + 90) % 360;
      //console.log('onDrag', dx, dy, r);
      context.params.rotate = r;
      window.store.dispatch({type:'setSelectionStyle', style:{transform:"rotate("+r+"deg)"}});
    }
  }
  
  render() {
    const scale = this.props.scale;
    const x = this.props.element.x * scale;
    const y = this.props.element.y * scale;
    const w = this.props.element.w * scale;
    const h = this.props.element.h * scale;
    var style = {left:x, top:y, position:'absolute', width:w, height:h};
    //console.log("Selection.style", this.props.selectionStyle);
    if (this.props.selectionStyle) {
       style=Object.assign(style, this.props.selectionStyle);
    }
    return (
      <div style={style}>
        <div className='selection' style={{
            left:-1, top:-1,
            width:w-2, height:h-2,
            border:"2px solid #00BCD4"
          }}
          draggable={true}
          onDragStart={(e)=>this.onDragStart(e,"move")}
        />
        <img className='handle' src='./turn_handle.png' alt=''
            style={{left:w/2-9, top:-9-20 }}
            draggable={true}
            onDragStart={(e)=>this.onDragStart(e,"turn")}
            onDrag={this.onDrag}
        />
        <img className='handle' src='./scale_handle.png' alt=''
            style={{left:w/2-9, top:-9 }}
            draggable={true}
            onDragStart={(e)=>this.onDragStart(e,"n")}
            onDrag={this.onDrag}
        />
        <img className='handle' src='./scale_handle.png' alt=''
            style={{left:w/2-9, top:h-9 }}
            draggable={true}
            onDragStart={(e)=>this.onDragStart(e,"s")}
            onDrag={this.onDrag}
        />
        <img className='handle' src='./scale_handle.png' alt=''
            style={{left:-9, top:h/2-9 }}
            draggable={true}
            onDragStart={(e)=>this.onDragStart(e,"w")}
            onDrag={this.onDrag}
        />
        <img className='handle' src='./scale_handle.png' alt=''
            style={{left:w-9, top:h/2-9 }}
            draggable={true}
            onDragStart={(e)=>this.onDragStart(e,"e")}
            onDrag={this.onDrag}
        />
        <img className='handle' src='./scale_handle.png' alt=''
            style={{left:-9, top:-9 }}
            draggable={true}
            onDragStart={(e)=>this.onDragStart(e,"nw")}
            onDrag={this.onDrag}
        />
        <img className='handle' src='./scale_handle.png' alt=''
            style={{left:w-9, top:-9 }}
            draggable={true}
            onDragStart={(e)=>this.onDragStart(e,"ne")}
            onDrag={this.onDrag}
        />
        <img className='handle' src='./scale_handle.png' alt=''
            style={{left:-9, top:h-9 }}
            draggable={true}
            onDragStart={(e)=>this.onDragStart(e,"sw")}
            onDrag={this.onDrag}
        />
        <img className='handle' src='./scale_handle.png' alt=''
            style={{left:w-9, top:h-9 }}
            draggable={true}
            onDragStart={(e)=>this.onDragStart(e,"se")}
            onDrag={this.onDrag}
        />
      </div>
    );
  }
}

export default Selection;
