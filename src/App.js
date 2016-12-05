import React, { Component } from 'react';
import './App.css';

// Super-simplified Redux
function createStore(reducer) {
    var state = reducer()
    var app;
    function dispatch(action) {
      state = reducer(state, action)
      app.setState(state)
    }
    function setApplication(obj) {
      app = obj;
      app.states = state;
    }
    function getState() {
      return state;
    }
    return { dispatch, setApplication, getState };
}

// Create the store with a reducer
var store = createStore((_state, action)=> {
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
       },{
         i1:{
           translate:[10, 40]
         }
       }]
    };
  }
  var state = Object.assign({}, _state);
  switch(action.type) {
  case 'duplicateScene':
    state.pages.push({});
    break;
  case 'duplicatePage':
    state.pages.push({});
    break;
  case 'deletePage':
    state.pages = state.pages.filter((p) => {return p!==action.page});
    break;
  case 'moveSceneElement':
    //console.log('moveSceneElement');
    state.elements = state.elements.map((element)=>{
       if (element.id === action.id) {
           element.x += action.dx;
           element.y += action.dy;
       }
       return element
    })
    break;
  case 'movePageElement':
    //console.log('movePageElement 1', action);
    var page = Object.assign({}, state.pages[action.pageIndex]);
    //console.log('movePageElement', page);
    var element = page[action.id] || {};
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

// Global variable to store dragging state
var dragger = {}

class Element extends Component {
  constructor(props) {
    super();
    this.onDragStart = this.onDragStart.bind(this);
  }
  
  onDragStart(e) {
    dragger = { element:this.props.element, pageIndex:this.props.pageIndex, id:this.props.element.id, x:e.clientX, y:e.clientY };
  }
  
  render() {
    return (
      <div className='element' style={{
          left:this.props.element.x, top:this.props.element.y,
          width:this.props.element.w, height:this.props.element.h,
          background:this.props.element.bc
        }}
        draggable={true}
        onDragStart={this.onDragStart}
      />
    );
  }
}

class Scene extends Component {
  constructor(props) {
    super();
    this.onDrop = this.onDrop.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
  }
  
  onDrop(e) {
    store.dispatch({type:'moveSceneElement', id:dragger.id,
                    dx:e.clientX-dragger.x, dy:e.clientY-dragger.y});
  }
  onDragOver(e) {
    if (dragger.pageIndex === -1) {
        e.preventDefault();
    }
  }
  render() {
    return (
      <div>
        <div className="scene" onDrop={this.onDrop} onDragOver={this.onDragOver}>{
          this.props.elements.map((element, index)=>{
            return <Element key={index} pageIndex={-1} element={element} />
          })
        }</div>
        <button onClick={()=>{store.dispatch({type:'duplicateScene'})}} >New Page</button>
      </div>
    );
  }
}

class Page extends Component {
  constructor(props) {
    super();
    this.onDrop = this.onDrop.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
  }

  onDrop(e) {
    //console.log("Page:OnDrop:", dragger.element);
    store.dispatch({type:'movePageElement', pageIndex:dragger.pageIndex, id:dragger.id,
                    dx:e.clientX-dragger.x, dy:e.clientY-dragger.y});
  }
  onDragOver(e) {
    if (dragger.pageIndex === this.props.pageIndex) {
        e.preventDefault();
    }
  }

  render() {
    this.sceneElements = this.props.sceneElements.map((sceneElement) => {
      var element = Object.assign({}, sceneElement);
      var e = this.props.page[element.id];
      if (typeof e === 'object' && e.translate.length===2) {
        console.log(e);
        element.x += e.translate[0];
        element.y += e.translate[1];
      }
      element.sceneElement = sceneElement;
      return element;
    });
    return (
      <div>
        <div className="page" onDrop={this.onDrop} onDragOver={this.onDragOver}>
          {this.sceneElements.map((element, index)=>{ return <Element key={index} pageIndex={this.props.pageIndex} element={element} />})}
        </div>
        <button onClick={()=>{store.dispatch({type:'deletePage', page:this.props.page})}} >Delete</button>
        <button onClick={()=>{store.dispatch({type:'duplicatePage', page:this.props.page})}} >Duplicate</button>
      </div>
    );
  }
}

class Pages extends Component {
  constructor(props) {
    super();
  }
    
    render() {
      return (
        <div>
        {
            this.props.pages.map((page, index)=>{ return <Page key={index} pageIndex={index} page={page} sceneElements={ this.props.elements } /> } )
        }
        </div>
      )
    }
}

class Publisher {
  constructor(store) {
    var state = store.getState();
    this.script = {
      type:"net.swipe.swipe",
      dimension:[240,135],
      paging:"leftToRight",
      orientation:"landscape",
      templates:{
        pages:{
          s0:{
            play: "scroll",
            elements: state.elements
          }
        }
      },
      pages: state.pages.map((page) => {
        return {scene:"s0", elements:Object.keys(page).map((id) => {
            return Object.assign({id:id}, {to:page[id]});
        })};
      })
    };
  }
  swipe() {
    var json = JSON.stringify(this.script, undefined, 2);
    console.log(json);
    return json;
  }
}

class App extends Component {
  constructor() {
    super();
    store.setApplication(this);
  }
  render() {
    return (
      <div className="App">
        <button onClick={(e)=>{alert((new Publisher(store)).swipe())}}>Show</button>
        <Scene elements={ this.states.elements }/>
        <Pages pages={ this.states.pages } elements={ this.states.elements }/>
      </div>
    );
  }
}

export default App;
