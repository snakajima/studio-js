//
// Copyright (c) 2016 Satoshi Nakajima (https://github.com/snakajima)
// License: The MIT License
//

import React, { Component } from 'react';
import Element from './Element';
import DragContext from './DragContext';

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
    }
  }
  
  onDrop(e) {
    const cotext = DragContext.getContext();
    const scale = this.props.width / this.props.dimension.width;
    window.store.dispatch({type:'moveSceneElement', id:cotext.id,
                    scale:scale,
                    dx:e.clientX-cotext.x, dy:e.clientY-cotext.y});
  }
  onDragOver(e) {
    if (DragContext.getContext().pageIndex === -1) {
        e.preventDefault();
    }
  }
  render() {
    const height = this.props.dimension.height * this.props.width / this.props.dimension.width;
    const scale = this.props.width / this.props.dimension.width;
    return (
        <div className={this.props.selected ? "canvasSceneSelected" : "canvasScene"}
             style={{width:this.props.width, height:height}}
            onClick={this.onClick}
             onDrop={this.onDrop} onDragOver={this.onDragOver}>{
          this.props.elements.map((element, index)=>{
             return <Element key={index} pageIndex={-1} element={element}
                                  scale={scale} main={this.props.main} />
          })
        }</div>
    );
  }
}

export default Scene;
