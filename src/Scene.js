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
    var cotext = DragContext.getContext();
    window.store.dispatch({type:'moveSceneElement', id:cotext.id,
                    scale:0.5,
                    dx:e.clientX-cotext.x, dy:e.clientY-cotext.y});
  }
  onDragOver(e) {
    if (DragContext.getContext().pageIndex === -1) {
        e.preventDefault();
    }
  }
  render() {
    var height = this.props.dimension.height * this.props.width / this.props.dimension.width;
    return (
      <div>
        <div className="canvasScene"
             style={{width:this.props.width, height:height}}
             onDrop={this.onDrop} onDragOver={this.onDragOver}>{
          this.props.elements.map((element, index)=>{
            return <Element key={index} pageIndex={-1} element={element} scale={0.5}/>
          })
        }</div>
        <button onClick={()=>{window.store.dispatch({type:'duplicateScene'})}} >Insert</button>
      </div>
    );
  }
}

export default Scene;
