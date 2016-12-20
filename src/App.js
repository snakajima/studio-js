import React, { Component } from 'react';
import './App.css';
import createStore from './SimpleRedux';
import Scene from './Scene';
import Pages from './Pages';
import Page from './Page';
import Preview from './Preview';
import MathEx from './MathEx';

window.store = createStore((_state, action)=> {
  if (typeof _state === "undefined") {
    return {
       screen:{
         width:100, height:100, pageIndex:0
       },
       dimension:{
          width:480, height:320
       },
       elements:[{
         id:"i0", x:10, y:30, h:20, w:50, bc:'#ff0000'
       },{
         id:"i1", x:50, y:60, h:60, w:50, bc:'#8080ff', "img":"http://satoshi.blogs.com/swipe/movie.png"
       },{
         id:"i2", x:80, y:50, h:30, w:50, bc:'#00ff00', "img":"http://satoshi.blogs.com/swipe/shuttlex.png"
       }],
       pages:[{
       }]
    };
  }
  var state = Object.assign({}, _state);
  switch(action.type) {
  case 'duplicateScene':
    state.pages.unshift({});
    break;
  case 'duplicatePage':
    state.pages.splice(action.pageIndex + 1, 0, Object.assign({}, action.page));
    break;
  case 'deletePage':
    state.pages.splice(action.pageIndex, 1);
    if (state.screen.pageIndex >=state.pages.length) {
      state.screen.pageIndex = state.pages.length-1;
    }
    break;
  case 'moveSceneElement':
    state.elements = state.elements.map((element)=>{
       if (element.id === action.id) {
           element.x = MathEx.round(element.x + action.dx / action.scale);
           element.y = MathEx.round(element.y + action.dy / action.scale);
       }
       return element
    })
    break;
  case 'movePageElement':
    var page = Object.assign({}, state.pages[action.pageIndex]);
    var element = Object.assign({}, page[action.id] || {});
    var tx = element.translate || [0,0];
    tx[0] = MathEx.round(tx[0] + action.dx / action.scale);
    tx[1] = MathEx.round(tx[1] + action.dy / action.scale);
    element.translate = tx;
    page[action.id] = element;
    state.pages[action.pageIndex] = page;
    break;
  case 'resize':
    state.screen.width = action.width;
    state.screen.height = action.height;
    break;
  case 'preview':
   state.screen.preview = action.preview;
    break;
  case 'select':
    state.screen.pageIndex = action.pageIndex;
    break;
  default:
    console.log("unknown type:" + action.type);
    break;
  }
  return state
});



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
    //console.log("didMount");
    window.addEventListener("resize", this.updateDimensions);
  }
  componentWillUnmount() {
    //console.log("willUnmount");
    window.removeEventListener("resize", this.updateDimensions);
  }
}

export default App;
