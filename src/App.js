import React, { Component } from 'react';
import './App.css';
import Generator from './Generator';
import createStore from './SimpleRedux';
import Scene from './Scene';
import Pages from './Pages';

window.store = createStore((_state, action)=> {
  if (typeof _state === "undefined") {
    return {
       elements:[{
         id:"i0", x:10, y:30, h:20, w:50, bc:'#f00'
       },{
         id:"i1", x:50, y:60, h:30, w:50, bc:'#00f'
       },{
         id:"i2", x:80, y:50, h:30, w:50, bc:'#0f0'
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
           element.x += action.dx;
           element.y += action.dy;
       }
       return element
    })
    break;
  case 'movePageElement':
    var page = Object.assign({}, state.pages[action.pageIndex]);
    var element = Object.assign({}, page[action.id] || {});
    var tx = element.translate || [0,0];
    tx = [tx[0] + action.dx, tx[1] + action.dy];
    element.translate = tx;
    page[action.id] = element;
    state.pages[action.pageIndex] = page;
    break;
  default:
    break;
  }
  return state
});

class App extends Component {
  constructor() {
    super();
    window.store.setApplication(this);
  }
  
  showSwipe() {
    alert((new Generator(window.store)).generate());
  }
  
  render() {
    return (
      <div className="App">
        <button onClick={ this.showSwipe }>Show</button>
        <Scene elements={ this.states.elements }/>
        <Pages pages={ this.states.pages }
               sceneElements={ this.states.elements }/>
      </div>
    );
  }
}

export default App;
