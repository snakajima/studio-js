//
// Copyright (c) 2016 Satoshi Nakajima (https://github.com/snakajima)
// License: The MIT License
//

import MathEx from './MathEx';

function reducer(_state, action) {
    if (typeof _state === "undefined") {
      const initialState = {
        pageIndex:0,
        preview:false,
        dimension:{ width:480, height:320 },
        elements:[{
            id:"i0", x:10, y:30, h:20, w:50, bc:'#ff0000'
          },{
            id:"i1", x:50, y:60, h:60, w:50, bc:'#8080ff', "img":"http://satoshi.blogs.com/swipe/movie.png"
          },{
            id:"i2", x:80, y:50, h:30, w:50, bc:'#00ff00', "img":"http://satoshi.blogs.com/swipe/shuttlex.png"
          }],
        pages:[{}]
      };
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
                state.pageIndex = state.pages.length-1;
            }
            break;
        case 'moveSceneElement':
            state.elements = state.elements.map((element)=>{
                if (element.id === action.id) {
                  var e = Object.assign({}, element);
                  e.x = MathEx.round(e.x + action.dx / action.scale);
                  e.y = MathEx.round(e.y + action.dy / action.scale);
                  return e;
                }
                return element
            })
            break;
        case 'movePageElement':
            var page = Object.assign({}, state.pages[action.pageIndex]);
            var element = Object.assign({}, page[action.id] || {});
            const tx = element.translate || [0,0];
            element.translate = [
              MathEx.round(tx[0] + action.dx / action.scale),
              MathEx.round(tx[1] + action.dy / action.scale)
            ];
            page[action.id] = element;
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
        case 'select':
            state.pageIndex = action.pageIndex;
            undoable = false;
            break;
        case 'setState':
            state = action.state;
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
    return state
}

module.exports = { reducer };
