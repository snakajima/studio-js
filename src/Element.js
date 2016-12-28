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
    DragContext.setContext({
      pageIndex:this.props.pageIndex,
      index: this.props.index,
      id:this.props.element.id, handle:"move",
      x:e.clientX, y:e.clientY });
  }
    
  onClick(e) {
    if (this.props.main) {
      e.stopPropagation();
        window.cursor.dispatch({type:'selectElement', selection:{ids:new Set([this.props.element.id])}});
        //window.cursor.dispatch({type:'selectElement', selection:[this.props.element.id]});
    }
  }
  
  render() {
    const scale = this.props.scale;
    const element = this.props.element;
    var style={
          left:element.x * scale, top:element.y * scale,
          width:element.w * scale, height:element.h * scale,
          background:element.bc
        };
    if (element.rotate) {
      style.transform="rotate("+element.rotate + "deg)";
    }
    if (element.scale) {
      //console.log("Element:render:scale=", element.scale);
      style.transform = (style.transform || "") + " scale("+element.scale[0]+","+element.scale[1]+")";
      //console.log("Element:render:scale=", element.scale, style.transform);
    }
    if (element.opacity) {
      style.opacity = element.opacity;
    }
    return (
      <div className='canvasElement' style={style}
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
