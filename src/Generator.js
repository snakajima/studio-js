//
// Copyright (c) 2016 Satoshi Nakajima (https://github.com/snakajima)
// License: The MIT License
//
import MathEx from './MathEx';
import Page from './Page';

function generate(store) {
  function delta(base, element) {
    var obj={};
    if (base.x !== element.x || base.y !== element.y) {
      obj.translate = [MathEx.round(element.x-base.x),
                         MathEx.round(element.y-base.y)];
    }
    if (base.rotate !== element.rotate) {
      obj.rotate = element.rotate || 0
    }
    return Object.keys(obj).length > 0 ? obj : null;
  }
  
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
        var elements = Page.applyTransform(state.elements, page);
        console.log("elements=", JSON.stringify(elements));
        obj.elements = elements.reduce((s, element, index) => {
               var d0 = delta(state.elements[index], prev[index]);
               const d1 = delta(state.elements[index], element);
               if (d0) {
                  d0.id = element.id;
                  if (d1) {
                    s.push(Object.assign(d0, {to:d1}));
                  } else {
                    s.push(Object.assign(d0, {to:{translate:[0,0]}}));
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
