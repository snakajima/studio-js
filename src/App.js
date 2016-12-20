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
    
  render() {
    const documentElement = document.documentElement,
        body = document.getElementsByTagName('body')[0],
        width = window.innerWidth || documentElement.clientWidth || body.clientWidth,
        height = window.innerHeight|| documentElement.clientHeight|| body.clientHeight;
    const leftWidth = Math.max(width/4, 140);
    const rightWidth = width - leftWidth - 8;
    const pageIndex = this.state.pageIndex;
    return (
      <div className="App">
        <div id="left">
            <div className="toolbar">
              <button onClick={ () => {window.store.dispatch({type:'preview', preview:true})} }>Play</button>
              <button disabled={!window.stack.undoable()}
                      onClick={ () => {window.stack.undo(window.store)} }>Undo</button>
             <button disabled={!window.stack.redoable()}
                      onClick={ () => {window.stack.redo(window.store)} }>Redo</button>
            </div>
            <Scene elements={ this.state.elements }
                   dimension={ this.state.dimension }
                   selected={ pageIndex===-1 }
                   main={false}
                   width={ leftWidth } />
            <div className="subToolbar">
               <button onClick={()=>{window.store.dispatch({type:'duplicateScene'})}} >Insert</button>
            </div>
            <Pages pages={ this.state.pages }
                   dimension={ this.state.dimension }
                   selectedPageIndex={ pageIndex }
                   width={ leftWidth } height={ height - 60 }
                   sceneElements={ this.state.elements }/>
        </div>
        <div id="center">
            <div className="toolbar">
            </div>
            {
            (pageIndex >=0) ?
              <Page pageIndex={this.state.pageIndex}
                    page={this.state.pages[pageIndex]}
                    dimension={ this.state.dimension }
                    width={ rightWidth }
                    main={true}
                    sceneElements={ this.state.elements} />
            : <Scene elements={ this.state.elements }
                     dimension={ this.state.dimension }
                     main={true}
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
