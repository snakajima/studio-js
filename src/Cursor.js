//
// Copyright (c) 2016 Satoshi Nakajima (https://github.com/snakajima)
// License: The MIT License
//

import React, { Component } from 'react';
import App from './App';
import Page from './Page';
import Selection from './Selection';
import createStore from './SimpleRedux';

class Cursor extends Component {
  constructor() {
    super();
    window.cursor.setApplication(this);
  }
  
  static reducer(_state, action) {
    if (typeof _state === "undefined") {
      return {};
    }
    
    var state = Object.assign({}, window.store.getState());
    switch(action.type) {
      case 'resize':
        break;
      case 'setSelectionStyle':
        break;
      default:
        console.log('Cursor:unknown action', action.type);
        break;
    }
    return state;
  }
  
  render() {
    const { leftWidth, rightWidth } = App.windowSize();
    const elements = Page.applyTransform(this.state.elements, this.state.pages[this.state.pageIndex]);
    //console.log('Cursor:elements', JSON.stringify(elements));
    const margin = this.state.margin || 0;
    const w = rightWidth - margin * 2;
    const scale = w / this.state.dimension.width;
    const selection = this.state.selection || {ids:new Set()}
    //console.log('Cursor:more', margin, w, scale, JSON.stringify(selection));
    return (
      <div>
        <div className='toolbar' style={{width:3}} ></div>
        <div className='frameScene' style={{width:leftWidth, float:'left', height:3}}>
        </div>
        <div style={{float:'left', background:'rgba(0, 255, 0, 0.2)', width:10, height:10, position:'relative'}}>
          <div style={{position:'absolute', left:margin + 1, top:margin+1}}>
        {elements.reduce((selections, element, index)=>{
                         if (selection.ids.has(element.id)) {
                           selections.push(<Selection key={index+1000} index={index}
                                         pageIndex={this.state.pageIndex}
                                         element={element} main={true}
                                         selectionStyle={this.state.selection.style}
                                         scale={scale} />);
                         }
                         return selections;
                }, [])}
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
