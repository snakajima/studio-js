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
import MathEx from './MathEx';
import Slider from './Slider';
import RangeSlider from './RangeSlider';
import Segment from './Segment';

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
    switch(action.type) {
      case 'update':
        break;
      case 'setSelectionStyle':
        if (state.selection) {
          state.selection = {ids:state.selection.ids, style:action.style};
        }
        break;
      case 'setSliderDragValue':
        if (state.selection) {
          //console.log('setSliderDragValue', action.value, action.name);
          state.selection = {ids:state.selection.ids, slider:action};
        }
        break;
      case 'setSliderValue':
        if (state.selection) {
          //console.log('setSliderValue', action.value, action.name);
          window.store.dispatch({
            type:'changeElement',
            set:action
          });
        }
        break;
      default:
        console.log('Cursor:unknown action', action.type);
        break;
    }
    return state;
  }

  onDrop(e) {
    //console.log('Cursor:onDrop');
    const context = DragContext.getContext();
    const scale = this.scale;
    window.store.dispatch({
                        type:'changeElement',
                        handle:context.handle,
                        scale:scale, params:context.params,
                        dx:e.clientX-context.x, dy:e.clientY-context.y});
  }

  onDragOver(e) {
    //console.log('Cursor:onDragOver');
    if (DragContext.getContext().pageIndex === this.state.pageIndex) {
      e.preventDefault();
    }
  }
  
  dispatcher(change) {
    return (e)=>{
      window.store.dispatch({
        type:'changeElement',
        change:change
      });
    };
  }

  render() {
    const selection = this.state.selection || {ids:new Set()}
    if (selection.ids.size === 0) {
      return <div></div>;
    }

    const { leftWidth, rightWidth, scrollbarWidth } = App.windowSize();
    const elements = (this.state.pageIndex >= 0) ?
        Page.applyTransform(this.state.elements, this.state.pages[this.state.pageIndex])
      : this.state.elements;
    //console.log('Cursor:elements', JSON.stringify(elements));
    const margin = this.state.margin || 0;
    const clientWidth = rightWidth - scrollbarWidth;
    const w = clientWidth - margin * 2;
    const scale = w / this.state.dimension.width;
    this.scale = scale; // HACK: pass this value to onDrop (is this a bad practice?)
    const height = this.state.dimension.height * scale + margin * 2;
    const context = DragContext.getContext();
    //console.log('Cursor:more', margin, w, scale, JSON.stringify(selection));
    var style = {};
    if (context.cursor) {
      style.width = clientWidth;
      style.height = height;
    }

    var selectedElements = [];
    var cursors = elements.reduce((selections, element, index)=>{
                              if (selection.ids.has(element.id)) {
                                  selectedElements.push(element);
                                  selections.push(<Selection key={index+1000} index={index}
                                                  pageIndex={this.state.pageIndex}
                                                  element={element} main={true}
                                                  selectionStyle={this.state.selection.style}
                                                  scale={scale} />);
                                  }
                                  return selections;
                              }, []);
    const firstElement = selectedElements[0];
    const selectionStyle = this.state.selection.style || {};
    const rotation = selectionStyle.rotate || firstElement.rotate || 0;
    var scales = firstElement.scale || [1, 1];
    if (selectionStyle.scale) {
      scales = [MathEx.round(scales[0] * selectionStyle.scale[0], 100),
                MathEx.round(scales[1] * selectionStyle.scale[1], 100)];
    }
    var position = {x:firstElement.x, y:firstElement.y};
    if (selectionStyle.translate) {
       position.x = MathEx.round(position.x + selectionStyle.translate[0] / scale);
       position.y = MathEx.round(position.y + selectionStyle.translate[1] / scale);
    }
    const fontSize = Math.floor(height / 32);
    const opacity = MathEx.valueOf(firstElement.opacity, 1);
    const timing = firstElement.timing || [0,1];
    const loop = firstElement.loop || {style:"none", count:3};
    return (
        <div className='unselectable' style={{position:'absolute', top:28, left:leftWidth}}>
          <div className='frameCursor' style={style} onDrop={this.onDrop} onDragOver={this.onDragOver}>
            <div style={{position:'absolute', left:margin, top:margin}}>
              {cursors}
            </div>
        </div>
        <div className='frameProperties'
             style={{position:'absolute', top:height+2, width:clientWidth, fontSize:fontSize}}>
             <div className='frameProperty'>
               <div className='fieldProperty'>Position:</div>
               <div className='fieldValue'>{position.x}, H{position.y}</div>
               <div style={{clear:'both'}}></div>
             </div>
             <div className='frameProperty'>
               <div className='fieldProperty'>Size:</div>
               <div className='fieldValue'>W{MathEx.round(firstElement.w * scales[0])} x H{MathEx.round(firstElement.h * scales[1])}</div>
               <div className='fieldValue'>x{scales[0]}, x{scales[1]}</div>
               <div style={{clear:'both'}}></div>
             </div>
             <div className='frameProperty'>
               <div className='fieldProperty'>Opacity:</div>
               <div className='fieldValue'>{opacity}</div>
               <Slider sections={10} cellSize={fontSize} value={opacity} name='opacity'
                slider={selection.slider} />
               <div style={{clear:'both'}}></div>
             </div>
             <div className='frameProperty'>
               <div className='fieldProperty'>Rotation:</div>
               <div className='fieldValue'>{rotation}</div>
               <div className='fieldButton' onClick={this.dispatcher({name:'rotate', delta:-15})}>-15</div>
               <div className='fieldButton' onClick={this.dispatcher({name:'rotate', delta:-1})}>-1</div>
               <div className='fieldButton' onClick={this.dispatcher({name:'rotate', delta:1})}>+1</div>
               <div className='fieldButton' onClick={this.dispatcher({name:'rotate', delta:15})}>+15</div>
               <div style={{clear:'both'}}></div>
             </div>
             <div className='frameProperty'>
               <div className='fieldProperty'>Timing:</div>
               <div className='fieldValue'>{timing[0]}〜{timing[1]}</div>
               <RangeSlider sections={10} cellSize={fontSize} value={timing} name='timing'
                slider={selection.slider} />
               <div style={{clear:'both'}}></div>
             </div>
             <div className='frameProperty'>
               <div className='fieldProperty'>Loop:</div>
               <div className='fieldValue'>{loop.style}{(loop.style==="none") ? "" : ", " + loop.count}</div>
               <Segment cellSize={fontSize*1.2} cellWidth={5.5 * Math.floor(fontSize * 2.0 / 3.0)}
                        name='loop' value={loop}
                        choices={["none", "wiggle", "blink", "vibrate", "spin", "shift"]}/>
               { (loop.style==="none") ? "" :
                 <div style={{float:'left'}}>
                   <div className='fieldButton' style={{marginLeft:4, opacity:(loop.count > 1) ? 1.0 : 0.5}}
                    onClick={this.dispatcher({name:'loop', delta:-1})}>-1</div>
                   <div className='fieldButton' onClick={this.dispatcher({name:'loop', delta:1})}>+1</div>
                 </div>
               }
               <div style={{clear:'both'}}></div>
             </div>
        </div>
      </div>
    )
  }
}

window.cursor = createStore(Cursor.reducer);

export default Cursor;
