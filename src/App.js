//
// Copyright (c) 2016 Satoshi Nakajima (https://github.com/snakajima)
// License: The MIT License
//

import React, { Component } from 'react';
import './App.css';
import createStore from './SimpleRedux';
import Scene from './Scene';
import Pages from './Pages';
import Page from './Page';
import Preview from './Preview';
import Reducer from './Reducer';
import UndoStack from './UndoStack';

window.stack = new UndoStack();
window.store = createStore(Reducer.reducer);

class App extends Component {
  constructor() {
    super();
    window.store.setApplication(this);
  }
  
  setState(state) {
    super.setState(state);
    window.cursor.dispatch({type:'update'});
  }
  
  // Note: no need to do .bind(this)
  dispatcher(action) {
    return () => { window.store.dispatch(action) };
  }
  
  static windowSize() {
    const documentElement = document.documentElement,
        body = document.getElementsByTagName('body')[0],
        width = window.innerWidth || documentElement.clientWidth || body.clientWidth,
        height = window.innerHeight|| documentElement.clientHeight|| body.clientHeight;
    const leftWidth = Math.max(width/4, 140);
    const rightWidth = width - leftWidth - 8;
    return { width, height, leftWidth, rightWidth };
  }
  
  render() {
    const { width, height, leftWidth, rightWidth } = App.windowSize();
    const pageIndex = this.state.pageIndex;
    var classSelected = "btnIA";
    var classFront = "btnIA";
    var classBack = "btnIA";
    if (this.state.selection.ids.size > 0) {
      classSelected = "btn";
      if (!this.state.selection.ids.has(this.state.elements[this.state.elements.length-1].id)) {
        classFront = "btn";
      }
      if (!this.state.selection.ids.has(this.state.elements[0].id)) {
        classBack = "btn";
      }
    }
    return (
      <div className="App" style={{userSelect:'none'}}>
        <div id="left">
            <div className="toolbar">
              <input className="btn" type="image" onClick={ this.dispatcher({type:'preview', preview:true}) }
                     src="./ic_color_play.png" />
              <input className={window.stack.undoable() ? "btn" : "btnIA"} type="image"
                     src="./ic_color_undo.png"
                  onClick={ () => {window.stack.undo(window.store)} } />
              <input className={window.stack.redoable() ? "btn" : "btnIA"} type="image"
                     src="./ic_color_redo.png"
                  onClick={ () => {window.stack.redo(window.store)} } />
              <input className="btn" type="image" onClick={ this.dispatcher({type:'debugReload'}) }
                     style={{float:'right', opacity:0.01}} src="./scale_handle.png" />
            </div>
            <Scene elements={ this.state.elements }
                   dimension={ this.state.dimension }
                   selected={ pageIndex===-1 }
                   main={false}
                   width={ leftWidth } />
            <div className="subToolbar">
               <input className="btnSM" type="image" src="./ic_color_add_page.png"
                      onClick={this.dispatcher({type:'duplicateScene'})} />
            </div>
            <Pages pages={ this.state.pages }
                   dimension={ this.state.dimension }
                   selectedPageIndex={ pageIndex }
                   width={ leftWidth } height={ height - 60 }
                   sceneElements={ this.state.elements }/>
        </div>
        <div id="center">
            <div className="toolbar">
              <input className={classSelected} type="image"
                     onClick={ this.dispatcher({type:'deleteElement', ids:this.state.selection.ids}) }
                     src="./ic_color_delete.png" />
              <input className={classBack} type="image"
                     onClick={ this.dispatcher({type:'moveElementBack', ids:this.state.selection.ids}) }
                     src="./ic_color_back_layer.png" />
              <input className={classFront} type="image"
                     onClick={ this.dispatcher({type:'moveElementFront', ids:this.state.selection.ids}) }
                     src="./ic_color_front_layer.png" />
              <input className="btn" type="image"
                     onClick={ this.dispatcher({type:'addElement'}) }
                     src="./ic_color_plus.png" />
            </div>
            {
            (pageIndex >=0) ?
              <Page pageIndex={this.state.pageIndex}
                    page={this.state.pages[pageIndex]}
                    dimension={ this.state.dimension }
                    width={ rightWidth }
                    main={true}
                    margin={this.state.margin}
                    selection={this.state.selection}
                    sceneElements={ this.state.elements} />
            : <Scene elements={ this.state.elements }
                     dimension={ this.state.dimension }
                     main={true}
                     margin={this.state.margin}
                     selection={this.state.selection}
                     width={ rightWidth } />
            }
        </div>
        { this.state.preview ? <Preview width={width} dimension={this.state.dimension} /> : "" }
      </div>
    );
  }
  
  updateDimensions() {
    window.store.dispatch({type:'resize'});
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

export default App;
