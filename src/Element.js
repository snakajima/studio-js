import React, { Component } from 'react';
import DragContext from './DragContext';

class Element extends Component {
  constructor(props) {
    super();
    this.onDragStart = this.onDragStart.bind(this);
  }
  
  onDragStart(e) {
    DragContext.setContext({ element:this.props.element, pageIndex:this.props.pageIndex, id:this.props.element.id, x:e.clientX, y:e.clientY });
  }
  
  render() {
    const scale = this.props.scale;
    return (
      <div className='canvasElement' style={{
          left:this.props.element.x * scale, top:this.props.element.y * scale,
          width:this.props.element.w * scale, height:this.props.element.h * scale,
          background:this.props.element.bc
        }}
        draggable={true}
        onDragStart={this.onDragStart}
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
