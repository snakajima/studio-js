//
// Copyright (c) 2016 Satoshi Nakajima (https://github.com/snakajima)
// License: The MIT License
//
import Page from './Page';

function generate(store) {
  
    const state = store.getState();
    var prev = state.elements;
    //const idsAll = state.elements.map((element) => element.id);
    return {
      type:"net.swipe.swipe",
      dimension:[state.dimension.width, state.dimension.height],
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
        var obj = {template:"s0"}
        const elements = Page.applyTransform(state.elements, page);
        console.log("elements=", JSON.stringify(elements));
        obj.elements = elements.reduce((s, element, index) => {
               const sceneElement = state.elements[index];
               var d0 = Page.extractDelta(sceneElement, prev[index], false);
               var d1 = Page.extractDelta(sceneElement, element, false);
               if (d0) {
                  d0.id = element.id;
                  if (d1) {
                    if (d0.translate && !d1.translate) {
                      d1.translate = [0,0];
                    }
                    if (d0.rotate && !d1.rotate) {
                      d1.rotate = sceneElement.rotate;
                    }
                    if (d0.opacity && !d1.opacity) {
                      d1.opacity = sceneElement.opacity;
                    }
                    s.push(Object.assign(d0, {to:d1}));
                  } else {
                    var delta = {};
                    if (d0.translate) {
                      delta.translate=[0,0]
                    }
                    if (d0.rotate) {
                      delta.rotate = sceneElement.rotate || 0;
                    }
                    s.push(Object.assign(d0, {to:delta}));
                  }
               } else if (d1) {
                 s.push({id:element.id, to:d1});
               }
              return s;
              }, []);
        prev = elements;
        return obj;
      })
    };
}

module.exports = { generate };
