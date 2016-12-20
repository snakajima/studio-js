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
window.stack.setStore(window.store);

class App extends Component {
  constructor() {
    super();
    window.store.setApplication(this);
  }
    
  render() {
    const leftWidth = this.state.screen.width/4;
    const rightWidth = this.state.screen.width - leftWidth - 8;
    const pageIndex = this.state.screen.pageIndex;
    return (
      <div className="App">
        <div id="left">
            <div className="toolbar">
              <button onClick={ () => {window.store.dispatch({type:'preview', preview:true})} }>Play</button>
              <button onClick={ () => {window.stack.undo()} }>Undo</button>
              <button onClick={ () => {window.stack.redo()} }>Redo</button>
            </div>
            <Scene elements={ this.state.elements }
                   dimension={ this.state.dimension }
                   selected={ pageIndex===-1 }
                   width={ leftWidth } />
            <div className="subToolbar">
            <button onClick={()=>{window.store.dispatch({type:'duplicateScene'})}} >Insert</button>
            </div>
            <Pages pages={ this.state.pages }
                   dimension={ this.state.dimension }
                   selectedPageIndex={ pageIndex }
                   width={ leftWidth } height={ this.state.screen.height - 60 }
                   sceneElements={ this.state.elements }/>
        </div>
        <div id="center">
            <div className="toolbar">
            </div>
            {
            (pageIndex >=0) ?
              <Page pageIndex={this.state.screen.pageIndex}
                    page={this.state.pages[pageIndex]}
                    dimension={ this.state.dimension }
                    width={ rightWidth }
                    sceneElements={ this.state.elements} />
            : <Scene elements={ this.state.elements }
                     dimension={ this.state.dimension }
                     width={ rightWidth } />
            }
        </div>
        { this.state.screen.preview ? <Preview /> : "" }
      </div>
    );
  }
  
  updateDimensions() {
    var w = window,
        d = document,
        documentElement = d.documentElement,
        body = d.getElementsByTagName('body')[0],
        width = w.innerWidth || documentElement.clientWidth || body.clientWidth,
        height = w.innerHeight|| documentElement.clientHeight|| body.clientHeight;
    window.store.dispatch({type:'resize', width:width, height:height});
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
