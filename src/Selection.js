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
    e.dataTransfer.setDragImage(e.target, -10000, -10000);
    const element = this.props.element;
    const scale = this.props.scale;
    const rad = (element.rotate || 0) / 180 * Math.PI;
    const dx = ox * Math.cos(rad) - oy * Math.sin(rad);
    const dy = ox * Math.sin(rad) + oy * Math.cos(rad);
    var context = {
      pageIndex:this.props.pageIndex,
      id:element.id, handle:handle,
      index:this.props.index,
      params:{},
      width:scale * element.w,
      height:scale * element.h,
      x:e.clientX, y:e.clientY,
      cx:e.clientX + dx, cy:e.clientY + dy };
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
    const dx = e.clientX - context.cx;
    const dy = e.clientY - context.cy;
    if (context.handle === 'turn') {
      const r = Math.round(Math.atan2(dy,dx) * 180 / Math.PI + 360 + 90) % 360;
      //console.log('onDrag', dx, dy, r);
      context.params.rotate = r;
      window.store.dispatch({type:'setSelectionStyle', style:{rotate:r}});
    } else if (context.handle === 'ne' || context.handle === 'nw'
               || context.handle === 'se'|| context.handle === 'sw') {
      const r = Math.sqrt(dx * dx + dy * dy);
      const r0 = Math.sqrt(context.width/2 * context.width/2 + context.height/2 * context.height/2);
      const ratio = r / r0;
      context.params.ratio = ratio;
      //console.log('onDrag', dx, dy, ratio);
      //console.log('onDrag', r, r0, ratio);
      window.store.dispatch({type:'setSelectionStyle', style:{scale:[ratio, ratio]}});
    } else if (context.handle === 'n' || context.handle === 's') {
      const r = Math.sqrt(dx * dx + dy * dy);
      const r0 = context.height/2;
      const ratio = r / r0;
      context.params.ratio = ratio;
      window.store.dispatch({type:'setSelectionStyle', style:{scale:[1,ratio]}});
    } else if (context.handle === 'e' || context.handle === 'w') {
      const r = Math.sqrt(dx * dx + dy * dy);
      const r0 = context.width/2;
      const ratio = r / r0;
      context.params.ratio = ratio;
      window.store.dispatch({type:'setSelectionStyle', style:{scale:[ratio, 1]}});
    } else if (context.handle === 'move') {
      window.store.dispatch({type:'setSelectionStyle', style:{translate:[dx, dy]}});
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
       x += w / 2;
       y += h / 2;
       w *= element.scale[0];
       h *= element.scale[1];
       x -= w / 2;
       y -= h / 2;
    }
    var style = {left:x, top:y, position:'absolute', width:w, height:h};
    if (this.props.selectionStyle) {
       const s = this.props.selectionStyle;
       var tx = [];
       if (s.translate) {
         tx.push("translate(" + s.translate[0] + "px," + s.translate[1] + "px)");
       }
       if (s.rotate) {
         tx.push("rotate("+s.rotate + "deg)");
       } else if (element.rotate) {
         tx.push("rotate("+element.rotate + "deg)");
       }
       if (s.scale) {
         tx.push("scale(" + s.scale[0] + "," + s.scale[1] + ")");
       }
       style.transform = tx.join(' ');
       //console.log('transform=', style.transform);
    } else if (element.rotate) {
       style.transform="rotate("+element.rotate + "deg)";
    }
    //console.log("Selection:style.transform=", style.transform);
    return (
      <div style={style}>
        <div className='selection' style={{
            left:-1, top:-1,
            width:w-2, height:h-2,
            border:"2px solid #00BCD4"
          }}
          draggable={true}
          onDragStart={(e)=>this.onDragStart(e,"move")}
          onDrag={this.onDrag}
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
