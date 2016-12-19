import React, { Component } from 'react';
import './App.css';
import Generator from './Generator';
import createStore from './SimpleRedux';
import Scene from './Scene';
import Pages from './Pages';
import Page from './Page';

window.store = createStore((_state, action)=> {
  if (typeof _state === "undefined") {
    return {
       screen:{
          width:100, height:100
       },
       dimension:{
          width:480, height:320
       },
       elements:[{
         id:"i0", x:10, y:30, h:20, w:50, bc:'#ff0000'
       },{
         id:"i1", x:50, y:60, h:60, w:50, bc:'#8080ff', "imgx":"http://satoshi.blogs.com/swipe/movie.png"
       },{
         id:"i2", x:80, y:50, h:30, w:50, bc:'#00ff00', "imgx":"http://satoshi.blogs.com/swipe/shuttlex.png"
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
  default:
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
  
  play() {
    var swipe = new Generator(window.store).generate();
    console.log(JSON.stringify(swipe, undefined, 2));
    var preview = document.getElementById('preview');
    preview.contentWindow.present(JSON.stringify(swipe, undefined, 2));
  }
  
  /*
  setState(state) {
    console.log("App:setState width=", state.width);
    super.setState(state);
  }
  */
  
  render() {
    console.log("App:width=" + this.states.screen.width + ",pagecount=" + this.states.pages.length);
    var leftWidth = this.states.screen.width/3;
    return (
      <div className="App">
        <div id="left">
            <button onClick={ this.play }>Preview</button>
            <Scene elements={ this.states.elements }
                   dimension={ this.states.dimension }
                   width={ leftWidth } />
            <Pages pages={ this.states.pages }
                   dimension={ this.states.dimension }
                   width={ leftWidth }
                   sceneElements={ this.states.elements }/>
        </div>
        <div id="center">
            <Page pageIndex={0} page={this.states.pages[0]}
                  dimension={ this.states.dimension }
                  width={ this.states.screen.width - leftWidth - 8 }
                  sceneElements={ this.states.elements} />
        </div>
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
