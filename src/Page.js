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
      if (delta.scale) {
        var r = e.scale || [1, 1];
        e.scale = [r[0] * delta.scale[0], r[1] * delta.scale[1]];
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
  
  static extractDelta(base, element, delta=true) {
    var obj={};
    if (base.x !== element.x || base.y !== element.y) {
      obj.translate = [MathEx.round(element.x-base.x),
                       MathEx.round(element.y-base.y)];
    }
    if (base.rotate !== element.rotate) {
      obj.rotate = element.rotate || 0
      if (delta) {
        obj.rotate -= base.rotate || 0
      }
    }
    if (base.scale !== element.scale) {
      obj.scale = element.scale || [1, 1];
      if (delta) {
        var r = base.rotate || [1,1];
        obj.scale[0] /= r[0];
        obj.scale[1] /= r[1];
      }
    }
    return Object.keys(obj).length > 0 ? obj : null;
  }

  render() {
    const elements = Page.applyTransform(this.props.sceneElements, this.props.page);
    const height = this.props.dimension.height * this.props.width / this.props.dimension.width;
    const scale = this.props.width / this.props.dimension.width;
    const selection = this.props.selection || new Set()
    return (
      <div>
        <div className={ this.props.selected ? "canvasPageSelected" : "canvasPage"}
             style={{ width:this.props.width, height:height }}
            onClick={this.onClick}
             onDrop={this.onDrop} onDragOver={this.onDragOver}>
            {elements.map((element, index)=>{ return <Element key={index} index={index} pageIndex={this.props.pageIndex} element={element} main={this.props.main}
              scale={scale} />})}
            {elements.reduce((selections, element, index)=>{
                             if (selection.has(element.id)) {
                               selections.push(<Selection key={index+1000} index={index}
                                             pageIndex={this.props.pageIndex}
                                             element={element} main={this.props.main}
                                             scale={scale} />);
                             }
                             return selections;
                    }, [])}
        </div>
      </div>
    );
  }
}

export default Page;
