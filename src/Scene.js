//
// Copyright (c) 2016 Satoshi Nakajima (https://github.com/snakajima)
// License: The MIT License
//

import React, { Component } from 'react';
import Element from './Element';
import DragContext from './DragContext';
import Selection from './Selection';

class Scene extends Component {
  constructor(props) {
    super();
    this.onDrop = this.onDrop.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    if (!this.props.main) {
      window.store.dispatch({type:'selectPage', pageIndex:-1});
    } else {
      console.log("Scene.onClick");
      window.store.dispatch({type:'selectElement', selection:{ids:new Set()}});
    }
  }
  
  onDrop(e) {
    const context = DragContext.getContext();
    const scale = this.props.width / this.props.dimension.width;
    window.store.dispatch({
        type:'moveSceneElement', id:context.id, index:context.index,
        handle:context.handle, params:context.params,
        scale:scale,
        dx:e.clientX-context.x, dy:e.clientY-context.y});
  }
  onDragOver(e) {
    if (DragContext.getContext().pageIndex === -1) {
        e.preventDefault();
    }
  }
  render() {
    const height = this.props.dimension.height * this.props.width / this.props.dimension.width;
    const scale = this.props.width / this.props.dimension.width;
    const selection = this.props.selection || {ids:new Set()}
    const selectedElements = this.props.elements.filter((e) => selection.ids.has(e.id));
    return (
        <div className={this.props.selected ? "canvasSceneSelected" : "canvasScene"}
             style={{width:this.props.width, height:height}}
            onClick={this.onClick}
             onDrop={this.onDrop} onDragOver={this.onDragOver}>
            {this.props.elements.map((element, index)=>{
               return <Element key={index} index={index} pageIndex={-1} element={element}
                                  scale={scale} main={this.props.main} />
               })
            }
            {selectedElements.map((element, index)=>{ return <Selection key={index+1000} index={index} pageIndex={-1} element={element} main={this.props.main}
                                  scale={scale} />})}
        </div>
    );
  }
}

export default Scene;
