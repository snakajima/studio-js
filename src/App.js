import React, { Component } from 'react';
import './App.css';
import createStore from './SimpleRedux';
import Scene from './Scene';
import Pages from './Pages';
import Page from './Page';
import Preview from './Preview';

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
    break;
  case 'moveSceneElement':
    state.elements = state.elements.map((element)=>{
       if (element.id === action.id) {
           element.x += action.dx / action.scale;
           element.y += action.dy / action.scale;
       }
       return element
    })
    break;
  case 'movePageElement':
    var page = Object.assign({}, state.pages[action.pageIndex]);
    var element = Object.assign({}, page[action.id] || {});
    var tx = element.translate || [0,0];
    tx = [tx[0] + action.dx / action.scale, tx[1] + action.dy / action.scale];
    element.translate = tx;
    page[action.id] = element;
    state.pages[action.pageIndex] = page;
    break;
  case 'resize':
    state.screen.width = action.width;
    state.screen.height = action.height;
    //console.log('resize:' + state.width + ',' + state.height);
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
    //console.log("App:constructor");
    super();
    window.store.setApplication(this);
  }
    
  render() {
    //console.log("App:width=" + this.states.screen.width + ",pagecount=" + this.states.pages.length);
    var leftWidth = this.states.screen.width/4;
    var preview = (this.states.screen.preview) ? <Preview /> : "";
    return (
      <div className="App">
        <div id="left">
            <div className="toolbar">
            <button onClick={ () => {window.store.dispatch({type:'preview', preview:true})} }>Preview</button>
            </div>
            <Scene elements={ this.states.elements }
                   dimension={ this.states.dimension }
                   width={ leftWidth } />
            <Pages pages={ this.states.pages }
                   dimension={ this.states.dimension }
                   selectedPageIndex={ this.states.screen.pageIndex }
                   width={ leftWidth } height={ this.states.screen.height - 60 }
                   sceneElements={ this.states.elements }/>
        </div>
        <div id="center">
            <div className="toolbar">
            </div>
            <Page pageIndex={this.states.screen.pageIndex} page={this.states.pages[this.states.screen.pageIndex]}
                  dimension={ this.states.dimension }
                  width={ this.states.screen.width - leftWidth - 8 }
                  sceneElements={ this.states.elements} />
        </div>
        { preview }
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
    //console.log("updateDimensions:" + width + "," + height);
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
