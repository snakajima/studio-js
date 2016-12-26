//
// Copyright (c) 2016 Satoshi Nakajima (https://github.com/snakajima)
// License: The MIT License
//

import MathEx from './MathEx';
import Page from './Page';
import Generator from './Generator';
import Loader from './Loader';

function applyMoveAction(element, action) {
  var e = Object.assign({}, element);
  const r = e.scale || [1,1];
  switch(action.handle) {
    case "turn":
      e.rotate = (e.rotate || 0) + action.params.rotate;
      break;
    case "sw":
    case "se":
    case "nw":
    case "ne":
      e.scale = [MathEx.round(r[0] * action.params.ratio, 100),
                 MathEx.round(r[1] * action.params.ratio, 100)];
      break;
    case "w":
    case "e":
      e.scale = [MathEx.round(r[0] * action.params.ratio, 100),
                 r[1]];
      break;
    case "n":
    case "s":
      e.scale = [r[0],
                 MathEx.round(r[1] * action.params.ratio, 100)];
      break;
    default: // move
      e.x = MathEx.round(e.x + action.dx / action.scale);
      e.y = MathEx.round(e.y + action.dy / action.scale);
      break;
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
        selection:{ids:new Set()},
        pageIndex:0,
        preview:false,
        dimension:{ width:480, height:320 },
        elements:[{
            id:"i0", x:10, y:30, h:20, w:50, bc:'#ff0000', rotate:30, opacity:0.5
          },{
            id:"i1", x:50, y:60, h:60, w:50, bc:'#8080ff', scale:[2, 2],
            "img":"http://satoshi.blogs.com/swipe/movie.png"
          },{
            id:"i2", x:80, y:50, h:30, w:50, bc:'#00ff00', "img":"http://satoshi.blogs.com/swipe/shuttlex.png"
          }],
        pages:[{},{i0:{opacity:1.0}, i1:{rotate:60, translate:[100,0]}, i2:{scale:[1.0, 3.0]}}]
    };
    //initialState.elementMap = elementMap(initialState.elements);
    initialState.nextIndex = initialState.elements.length;
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
      state.selection = {ids:state.selection.ids};
      break;
    case 'movePageElement':
      console.log("movePageElement", JSON.stringify(action));
      const sceneElement = state.elements[action.index];
      //console.log("movePagedElement:sE=", JSON.stringify(sceneElement));
      var page = Object.assign({}, state.pages[action.pageIndex]);
      const pageElement = Page.applyTransformElement(sceneElement, page[action.id]);
      //console.log("movePagedElement:pE=", JSON.stringify(pageElement));
      var movedElement = applyMoveAction(pageElement, action);
      //console.log("movePagedElement:mE=", JSON.stringify(movedElement));
      page[action.id] = Page.extractDelta(sceneElement, movedElement);
      //console.log("movePagedElement:delta=", JSON.stringify(page[action.id]));
      state.pages = state.pages.map((page) => page);
      state.pages[action.pageIndex] = page;
      state.selection = {ids:state.selection.ids};
      break;
    case 'deleteElement':
      if (action.ids.size > 0) {
          state.elements = state.elements.filter((element) => {
             return !action.ids.has(element.id);
          });
          state.pages = state.pages.map((page) => {
            const ids = Object.keys(page).filter((id) => !action.ids.has(id));
            return ids.reduce((p, id) => {
              p[id] = page[id];
              return p;
            }, {});
          });
          state.selection = {ids:new Set()};
      } else {
        undoable = false;
      }
      break;
    case 'addElement':
      console.log('addElement', state.nextIndex);
      state.elements = state.elements.map((element) => element);
      state.elements.push({
         id:"i"+state.nextIndex, x:10 * state.nextIndex, y:10 * state.nextIndex, h:100, w:100, bc:'#ff00ff'
      });
      state.nextIndex++;
      break;
    case 'debugReload':
      console.log('debugReload');
      const swipe = Generator.generate(window.store);
      state = Loader.load(swipe, state);
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
        //console.log('selectElement', JSON.stringify(state.selection));
        undoable = false;
        break;
    case 'setSelectionStyle':
        if (state.selection) {
          state.selection = {ids:state.selection.ids, style:action.style};
        }
        undoable = false;
        break;
    default:
        console.log("unknown type:", JSON.stringify(action));
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
