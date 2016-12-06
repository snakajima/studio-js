import React, { Component } from 'react';
import DragContext from './DragContext';
import Element from './Element';

class Page extends Component {
  constructor(props) {
    super();
    this.onDrop = this.onDrop.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
  }

  onDrop(e) {
    var dragger = DragContext.getContext();
    window.store.dispatch({type:'movePageElement', pageIndex:dragger.pageIndex, id:dragger.id,
                    dx:e.clientX-dragger.x, dy:e.clientY-dragger.y});
  }
  onDragOver(e) {
    var dragger = DragContext.getContext();
    if (dragger.pageIndex === this.props.pageIndex) {
        e.preventDefault();
    }
  }

  render() {
    this.sceneElements = this.props.sceneElements.map((sceneElement) => {
      var element = Object.assign({}, sceneElement);
      var e = this.props.page[element.id];
      if (typeof e === 'object' && e.translate.length===2) {
        element.x += e.translate[0];
        element.y += e.translate[1];
      }
      element.sceneElement = sceneElement;
      return element;
    });
    return (
      <div>
        <div className="page" onDrop={this.onDrop} onDragOver={this.onDragOver}>
          {this.sceneElements.map((element, index)=>{ return <Element key={index} pageIndex={this.props.pageIndex} element={element} />})}
        </div>
        <button onClick={()=>{window.store.dispatch({type:'deletePage', pageIndex:this.props.pageIndex})}} >Delete</button>
        <button onClick={()=>{window.store.dispatch({type:'duplicatePage', page:this.props.page, pageIndex:this.props.pageIndex})}} >Duplicate</button>
      </div>
    );
  }
}

export default Page;
