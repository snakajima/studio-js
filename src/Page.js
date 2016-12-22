//
// Copyright (c) 2016 Satoshi Nakajima (https://github.com/snakajima)
// License: The MIT License
//

import React, { Component } from 'react';
import DragContext from './DragContext';
import Element from './Element';
import Selection from './Selection';
import MathEx from './MathEx';

class Page extends Component {
  constructor(props) {
    super();
    this.onDrop = this.onDrop.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.onClick = this.onClick.bind(this);
  }
    
  onClick(e) {
    if (!this.props.main) {
      window.store.dispatch({type:'selectPage', pageIndex:this.props.pageIndex});
    } else {
      console.log("Page.onClick");
      window.store.dispatch({type:'selectElement', selection:new Set()});
    }
  }

  onDrop(e) {
    const context = DragContext.getContext();
    const scale = this.props.width / this.props.dimension.width;
    window.store.dispatch({
        type:'movePageElement', pageIndex:context.pageIndex,
        handle:context.handle,
        id:context.id, scale:scale, index:context.index,
        dx:e.clientX-context.x, dy:e.clientY-context.y});
  }
  
  onDragOver(e) {
    if (DragContext.getContext().pageIndex === this.props.pageIndex) {
        e.preventDefault();
    }
  }
  
  static applyTransformElement(element, delta) {
    if (delta) {
      var e = Object.assign({}, element);
      if (delta.translate) {
        e.x += delta.translate[0];
        e.y += delta.translate[1];
      }
      if (delta.rotate) {
        e.rotate = (e.rotate || 0) + delta.rotate;
      }
      return e;
    }
    return element;
  }
  
  static applyTransform(elements, deltas) {
    return elements.map((element)=>{
      return Page.applyTransformElement(element, deltas[element.id]);
    });
  }
  
  static extractDelta(base, element) {
    var obj={};
    if (base.x !== element.x || base.y !== element.y) {
      obj.translate = [MathEx.round(element.x-base.x),
                       MathEx.round(element.y-base.y)];
    }
    if (base.rotate !== element.rotate) {
      obj.rotate = element.rotate || 0
    }
    return Object.keys(obj).length > 0 ? obj : null;
  }

  render() {
    const elements = Page.applyTransform(this.props.sceneElements, this.props.page);
    const height = this.props.dimension.height * this.props.width / this.props.dimension.width;
    const scale = this.props.width / this.props.dimension.width;
    const selection = this.props.selection || new Set()
    const selectedElements = elements.filter((e) => selection.has(e.id));
    return (
      <div>
        <div className={ this.props.selected ? "canvasPageSelected" : "canvasPage"}
             style={{ width:this.props.width, height:height }}
            onClick={this.onClick}
             onDrop={this.onDrop} onDragOver={this.onDragOver}>
            {elements.map((element, index)=>{ return <Element key={index} index={index} pageIndex={this.props.pageIndex} element={element} main={this.props.main}
              scale={scale} />})}
          {selectedElements.map((element, index)=>{
            return <Selection key={index+1000} pageIndex={this.props.pageIndex}
                              element={element} main={this.props.main}
                              scale={scale} />})}
        </div>
      </div>
    );
  }
}

export default Page;
