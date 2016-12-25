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

  onDragStart(e,handle, ox=0, oy=0) {
    const element = this.props.element;
    const scale = this.props.scale;
    var context = {
      pageIndex:this.props.pageIndex,
      id:element.id, handle:handle,
      index:this.props.index,
      params:{},
      width:scale * element.w,
      height:scale * element.h,
      x:e.clientX, y:e.clientY,
      cx:e.clientX + ox, cy:e.clientY + oy };
    if (element.scale) {
       context.width *= element.scale[0];
       context.height *= element.scale[1];
    }
    //console.log('onDragStart', context.width/2, context.height/2);
    DragContext.setContext(context);
  }
  onDrag(e) {
    var context = DragContext.getContext();
    //const element = context.element;
    //console.log('onDrag', context.handle, element.x, element.w);
    if (context.handle === 'turn') {
      const dx = e.clientX - context.cx;
      const dy = e.clientY - context.cy;
      const r = Math.round(Math.atan2(dy,dx) * 180 / Math.PI + 360 + 90) % 360;
      //console.log('onDrag', dx, dy, r);
      context.params.rotate = r;
      window.store.dispatch({type:'setSelectionStyle', style:{transform:"rotate("+r+"deg)"}});
    } else if (context.handle === 'ne' || context.handle === 'nw'
               || context.handle === 'se'|| context.handle === 'sw') {
      const dx = e.clientX - context.cx;
      const dy = e.clientY - context.cy;
      const r = Math.sqrt(dx * dx + dy * dy);
      const r0 = Math.sqrt(context.width/2 * context.width/2 + context.height/2 * context.height/2);
      const ratio = r / r0;
      context.params.ratio = ratio;
      //console.log('onDrag', dx, dy, ratio);
      //console.log('onDrag', r, r0, ratio);
      window.store.dispatch({type:'setSelectionStyle', style:{transform:"scale("+ratio+")"}});
    } else if (context.handle === 'n' || context.handle === 's') {
      const dy = e.clientY - context.cy;
      const r = Math.sqrt(dy * dy);
      const r0 = context.height/2;
      const ratio = r / r0;
      context.params.ratio = ratio;
      window.store.dispatch({type:'setSelectionStyle', style:{transform:"scale(1,"+ratio+")"}});
    } else if (context.handle === 'e' || context.handle === 'w') {
      const dx = e.clientX - context.cx;
      const r = Math.sqrt(dx * dx);
      const r0 = context.width/2;
      const ratio = r / r0;
      context.params.ratio = ratio;
      window.store.dispatch({type:'setSelectionStyle', style:{transform:"scale("+ratio+",1)"}});
    }
  }
  
  render() {
    const scale = this.props.scale;
    const element = this.props.element;
    var x = element.x * scale;
    var y = element.y * scale;
    var w = element.w * scale;
    var h = element.h * scale;
    if (element.scale) {
       x -= element.w * (element.scale[0] - 1) / 2;
       y -= element.h * (element.scale[1] - 1) / 2;
       w *= element.scale[0];
       h *= element.scale[1];
    }
    var style = {left:x, top:y, position:'absolute', width:w, height:h};
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
            onDragStart={(e)=>this.onDragStart(e,"turn", 0, h/2 + 20)}
            onDrag={this.onDrag}
        />
        <img className='handle' src='./scale_handle.png' alt=''
            style={{left:w/2-9, top:-9 }}
            draggable={true}
            onDragStart={(e)=>this.onDragStart(e,"n", 0, h/2)}
            onDrag={this.onDrag}
        />
        <img className='handle' src='./scale_handle.png' alt=''
            style={{left:w/2-9, top:h-9 }}
            draggable={true}
            onDragStart={(e)=>this.onDragStart(e,"s", 0, -h/2)}
            onDrag={this.onDrag}
        />
        <img className='handle' src='./scale_handle.png' alt=''
            style={{left:-9, top:h/2-9 }}
            draggable={true}
            onDragStart={(e)=>this.onDragStart(e,"w", w/2, 0)}
            onDrag={this.onDrag}
        />
        <img className='handle' src='./scale_handle.png' alt=''
            style={{left:w-9, top:h/2-9 }}
            draggable={true}
            onDragStart={(e)=>this.onDragStart(e,"e", -w/2, 0)}
            onDrag={this.onDrag}
        />
        <img className='handle' src='./scale_handle.png' alt=''
            style={{left:-9, top:-9 }}
            draggable={true}
            onDragStart={(e)=>this.onDragStart(e,"nw", w/2, h/2)}
            onDrag={this.onDrag}
        />
        <img className='handle' src='./scale_handle.png' alt=''
            style={{left:w-9, top:-9 }}
            draggable={true}
            onDragStart={(e)=>this.onDragStart(e,"ne", -w/2, h/2)}
            onDrag={this.onDrag}
        />
        <img className='handle' src='./scale_handle.png' alt=''
            style={{left:-9, top:h-9 }}
            draggable={true}
            onDragStart={(e)=>this.onDragStart(e,"sw", w/2, -h/2)}
            onDrag={this.onDrag}
        />
        <img className='handle' src='./scale_handle.png' alt=''
            style={{left:w-9, top:h-9 }}
            draggable={true}
            onDragStart={(e)=>this.onDragStart(e,"se", -w/2, -h/2)}
            onDrag={this.onDrag}
        />
      </div>
    );
  }
}

export default Selection;
