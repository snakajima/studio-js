import React, { Component } from 'react';
import DragContext from './DragContext';
import Element from './Element';

class Page extends Component {
  constructor(props) {
    super();
    this.onDrop = this.onDrop.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    console.log("scale=" + this.scale);
  }

  onDrop(e) {
    var context = DragContext.getContext();
    window.store.dispatch({type:'movePageElement', pageIndex:context.pageIndex, id:context.id, scale:this.props.scale,
                    dx:e.clientX-context.x, dy:e.clientY-context.y});
  }
  
  onDragOver(e) {
    if (DragContext.getContext().pageIndex === this.props.pageIndex) {
        e.preventDefault();
    }
  }

  render() {
    const elements = this.props.sceneElements.map((sceneElement) => {
      var element = Object.assign({}, sceneElement);
      var e = this.props.page[element.id] || { translate:[0,0] };
      element.x += e.translate[0];
      element.y += e.translate[1];
      return element;
    });
    const scale = this.props.scale;
    return (
      <div>
        <div className="canvasPage" onDrop={this.onDrop} onDragOver={this.onDragOver}>
          {elements.map((element, index)=>{ return <Element key={index} pageIndex={this.props.pageIndex} element={element}
              scale={scale} />})}
        </div>
        <button onClick={()=>{window.store.dispatch({type:'deletePage', pageIndex:this.props.pageIndex})}} >Delete</button>
        <button onClick={()=>{window.store.dispatch({type:'duplicatePage', page:this.props.page, pageIndex:this.props.pageIndex})}} >Duplicate</button>
      </div>
    );
  }
}

export default Page;
