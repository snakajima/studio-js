//
// Copyright (c) 2016 Satoshi Nakajima (https://github.com/snakajima)
// License: The MIT License
//

import React, { Component } from 'react';
import App from './App';
import Page from './Page';
import Selection from './Selection';
import DragContext from './DragContext';
import createStore from './SimpleRedux';

class Cursor extends Component {
  constructor() {
    super();
    window.cursor.setApplication(this);
    this.onDrop = this.onDrop.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
  }
  
  static reducer(_state, action) {
    if (typeof _state === "undefined") {
      return {};
    }
    
    var state = Object.assign({}, window.store.getState());
    if (_state.selection) {
      state.selection = Object.assign({}, _state.selection);
    }
    switch(action.type) {
      case 'resize':
        break;
      case 'selectElement':
        state.selection = action.selection;
        break;
      case 'setSelectionStyle':
        if (state.selection) {
          state.selection = {ids:state.selection.ids, style:action.style};
        }
        break;
      default:
        console.log('Cursor:unknown action', action.type);
        break;
    }
    return state;
  }

  onDrop(e) {
    console.log('Cursor:onDrop');
    const context = DragContext.getContext();
    const scale = (this.width - this.state.margin * 2)/ this.state.dimension.width;
    if (this.state.pageIndex >= 0) {
      window.store.dispatch({
                            type:'movePageElement', pageIndex:context.pageIndex,
                            handle:context.handle,
                            id:context.id, scale:scale, index:context.index, params:context.params,
                            dx:e.clientX-context.x, dy:e.clientY-context.y});
    } else {
      window.store.dispatch({
                            type:'moveSceneElement', id:context.id, index:context.index,
                            handle:context.handle, params:context.params,
                            scale:scale,
                            dx:e.clientX-context.x, dy:e.clientY-context.y});
    }
  }

  onDragOver(e) {
    //console.log('Cursor:onDragOver');
    if (DragContext.getContext().pageIndex === this.state.pageIndex) {
      e.preventDefault();
    }
  }

  render() {
    const { leftWidth, rightWidth } = App.windowSize();
    const elements = (this.state.pageIndex >= 0) ?
        Page.applyTransform(this.state.elements, this.state.pages[this.state.pageIndex])
      : this.state.elements;
    //console.log('Cursor:elements', JSON.stringify(elements));
    const margin = this.state.margin || 0;
    const w = rightWidth - margin * 2;
    this.width = w; // HACK: pass this value to onDrop (is this a bad practice?)
    const scale = w / this.state.dimension.width;
    const height = this.state.dimension.height * scale + margin * 2;
    const selection = this.state.selection || {ids:new Set()}
    const context = DragContext.getContext();
    //console.log('Cursor:more', margin, w, scale, JSON.stringify(selection));
    var style = {float:'left', background:'rgba(0, 255, 0, 0.2)', width:10, height:10, position:'relative'};
    if (context.cursor) {
      style.width = rightWidth;
      style.height = height;
    }

    var cursors = elements.reduce((selections, element, index)=>{
                                  if (selection.ids.has(element.id)) {
                                  selections.push(<Selection key={index+1000} index={index}
                                                  pageIndex={this.state.pageIndex}
                                                  element={element} main={true}
                                                  selectionStyle={this.state.selection.style}
                                                  scale={scale} />);
                                  }
                                  return selections;
                                  }, []);
    return (
      <div>
        <div className='toolbar' style={{width:3}} ></div>
        <div className='frameScene' style={{width:leftWidth, float:'left', height:3}}>
        </div>
          <div style={style} onDrop={this.onDrop} onDragOver={this.onDragOver}>
          <div style={{position:'absolute', left:margin + 1, top:margin+1}}>
            {cursors}
          </div>
        </div>
      </div>
    )
  }
  
  updateDimensions() {
    window.cursor.dispatch({type:'resize'});
  }
  componentWillMount() {
    this.updateDimensions();
  }
  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }
}

window.cursor = createStore(Cursor.reducer);

export default Cursor;
