import React, { Component } from 'react';
import DragContext from './DragContext';
import Element from './Element';

class Page extends Component {
  constructor(props) {
    super();
    this.onDrop = this.onDrop.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    //console.log("Page:width=" + props.width);
  }

  onDrop(e) {
    var context = DragContext.getContext();
    const scale = this.props.width / this.props.dimension.width;
    window.store.dispatch({type:'movePageElement', pageIndex:context.pageIndex, id:context.id, scale:scale,
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
    const height = this.props.dimension.height * this.props.width / this.props.dimension.width;
    const scale = this.props.width / this.props.dimension.width;
    return (
      <div>
        <div className="canvasPage"
             style={{ width:this.props.width, height:height }}
             onDrop={this.onDrop} onDragOver={this.onDragOver}>
          {elements.map((element, index)=>{ return <Element key={index} pageIndex={this.props.pageIndex} element={element}
              scale={scale} />})}
        </div>
        <div className="subToolbar">
        <button onClick={()=>{window.store.dispatch({type:'deletePage', pageIndex:this.props.pageIndex})}} >Delete</button>
        <button onClick={()=>{window.store.dispatch({type:'duplicatePage', page:this.props.page, pageIndex:this.props.pageIndex})}} >Duplicate</button>
        </div>
      </div>
    );
  }
}

export default Page;
