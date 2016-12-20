import React, { Component } from 'react';
import './App.css';
import createStore from './SimpleRedux';
import Scene from './Scene';
import Pages from './Pages';
import Page from './Page';
import Preview from './Preview';
import Reducer from './Reducer';

window.store = createStore(Reducer.reducer);

class App extends Component {
  constructor() {
    super();
    window.store.setApplication(this);
  }
    
  render() {
    const leftWidth = this.states.screen.width/4;
    const rightWidth = this.states.screen.width - leftWidth - 8;
    const pageIndex = this.states.screen.pageIndex;
    return (
      <div className="App">
        <div id="left">
            <div className="toolbar">
            <button onClick={ () => {window.store.dispatch({type:'preview', preview:true})} }>Preview</button>
            </div>
            <Scene elements={ this.states.elements }
                   dimension={ this.states.dimension }
                   selected={ pageIndex===-1 }
                   width={ leftWidth } />
            <div className="subToolbar">
            <button onClick={()=>{window.store.dispatch({type:'duplicateScene'})}} >Insert</button>
            </div>
            <Pages pages={ this.states.pages }
                   dimension={ this.states.dimension }
                   selectedPageIndex={ pageIndex }
                   width={ leftWidth } height={ this.states.screen.height - 60 }
                   sceneElements={ this.states.elements }/>
        </div>
        <div id="center">
            <div className="toolbar">
            </div>
            {
            (pageIndex >=0) ?
              <Page pageIndex={this.states.screen.pageIndex}
                    page={this.states.pages[pageIndex]}
                    dimension={ this.states.dimension }
                    width={ rightWidth }
                    sceneElements={ this.states.elements} />
            : <Scene elements={ this.states.elements }
                     dimension={ this.states.dimension }
                     width={ rightWidth } />
            }
        </div>
        { this.states.screen.preview ? <Preview /> : "" }
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
