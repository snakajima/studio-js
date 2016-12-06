import React, { Component } from 'react';
import Element from './Element';
import DragContext from './DragContext';

class Scene extends Component {
  constructor(props) {
    super();
    this.onDrop = this.onDrop.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
  }
  
  onDrop(e) {
    var dragger = DragContext.getContext();
    window.store.dispatch({type:'moveSceneElement', id:dragger.id,
                    dx:e.clientX-dragger.x, dy:e.clientY-dragger.y});
  }
  onDragOver(e) {
    var dragger = DragContext.getContext();
    if (dragger.pageIndex === -1) {
        e.preventDefault();
    }
  }
  render() {
    return (
      <div>
        <div className="scene" onDrop={this.onDrop} onDragOver={this.onDragOver}>{
          this.props.elements.map((element, index)=>{
            return <Element key={index} pageIndex={-1} element={element} />
          })
        }</div>
        <button onClick={()=>{window.store.dispatch({type:'duplicateScene'})}} >Insert</button>
      </div>
    );
  }
}

export default Scene;
