//
// Copyright (c) 2016 Satoshi Nakajima (https://github.com/snakajima)
// License: The MIT License
//

import MathEx from './MathEx';
import Page from './Page';

function applyMoveAction(element, action) {
  var e = Object.assign({}, element);
  const r = e.scale || [1,1];
  switch(action.handle) {
    case "turn":
      e.rotate = (e.rotate || 0) + 10;
      break;
    case "ne":
      e.scale = [r[0] * 1.41, r[1] * 1.41];
      break;
    case "e":
      e.scale = [r[0] * 1.41, r[1]];
      break;
    case "n":
      e.scale = [r[0], r[1] * 1.41];
      break;
    default: // move
      e.x = MathEx.round(e.x + action.dx / action.scale);
      e.y = MathEx.round(e.y + action.dy / action.scale);
  }
  return e;
}

function reducer(_state, action) {
  // The elementMap maps the element id to index.
  // We store it as a property of the state only for convenience.
  /*
  function elementMap(elements) {
    return elements.reduce((map, v, index)=>{
                            map[v.id] = index;
                            return map;
                           }, {});
  }
  */
  
  if (typeof _state === "undefined") {
    var initialState = {
        selection:new Set(),
        pageIndex:0,
        preview:false,
        dimension:{ width:480, height:320 },
        elements:[{
            id:"i0", x:10, y:30, h:20, w:50, bc:'#ff0000', rotate:30
          },{
            id:"i1", x:50, y:60, h:60, w:50, bc:'#8080ff', scale:[2, 2],
            "img":"http://satoshi.blogs.com/swipe/movie.png"
          },{
            id:"i2", x:80, y:50, h:30, w:50, bc:'#00ff00', "img":"http://satoshi.blogs.com/swipe/shuttlex.png"
          }],
        pages:[{},{i1:{rotate:60, translate:[100,0]}, i2:{scale:[1.0, 3.0]}}]
    };
    //initialState.elementMap = elementMap(initialState.elements);
    window.stack.append(initialState);
    return initialState;
  }
  // *** IMPORTANT ***
  // In order to enable undo and redo, we must strictly follow the Redux guideline.
  // Do not modify the state object or its sub-objects (no side effect).
  var state = Object.assign({}, _state);
  var undoable = true;
  switch(action.type) {
    case 'duplicateScene':
        state.pages = state.pages.map((page) => page);
        state.pages.unshift({});
        break;
    case 'duplicatePage':
        state.pages = state.pages.map((page) => page);
        state.pages.splice(action.pageIndex + 1, 0, Object.assign({}, action.page));
        break;
    case 'deletePage':
        state.pages = state.pages.map((page) => page);
        state.pages.splice(action.pageIndex, 1);
        if (state.pageIndex >=state.pages.length) {
          state.pageIndex = state.pages.length - 1;
        }
        break;
    case 'moveSceneElement':
        console.log("moveSceneElement", action.handle, action.index);
        state.elements = state.elements.map((element)=>{
          return (element.id === action.id) ?
            applyMoveAction(element, action) : element
        })
        break;
    case 'movePageElement':
      console.log("movePageElement", action.handle, action.index);
      const sceneElement = state.elements[action.index];
      var page = Object.assign({}, state.pages[action.pageIndex]);
      const pageElement = Page.applyTransformElement(sceneElement, page[action.id]);
      var movedElement = applyMoveAction(pageElement, action);
      page[action.id] = Page.extractDelta(sceneElement, movedElement);
      state.pages = state.pages.map((page) => page);
      state.pages[action.pageIndex] = page;
      break;
    case 'resize':
        undoable = false;
        break;
    case 'preview':
        state.preview = action.preview;
        undoable = false;
        break;
    case 'selectPage':
        state.pageIndex = action.pageIndex;
        undoable = false;
        break;
    case 'setState':
        state = action.state;
        undoable = false;
        break;
    case 'selectElement':
        state.selection = action.selection;
        undoable = false;
        break;
    default:
        console.log("unknown type:" + action.type);
        undoable = false;
        break;
  }
  if (undoable) {
    window.stack.append(state);
  }
  //state.elementMap = elementMap(state.elements);
  return state
}

module.exports = { reducer };
