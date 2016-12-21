//
// Copyright (c) 2016 Satoshi Nakajima (https://github.com/snakajima)
// License: The MIT License
//

function generate(store) {
  function applyTransform(elements, deltas) {
    return elements.map((element)=>{
                        var e = Object.assign({}, element);
                        const delta = deltas[element.id];
                        if (delta) {
                          console.log("delta=", JSON.stringify(delta));
                          if (delta.translate) {
                            e.x += delta.translate[0];
                            e.y += delta.translate[1];
                          }
                        }
                        return e;
                      });
  }
  function delta(base, element) {
    //if (base.x != element.x || base.y != element.y) {
    return {id:base.id, translate:[element.x-base.x, element.y-base.y]};
    //}
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
        var elements = applyTransform(prev, page);
        console.log("elements=", JSON.stringify(elements));
        obj.elements = elements.reduce((s, element, index) => {
                                       var d0 = delta(state.elements[index], prev[index]);
                                       const d1 = delta(prev[index], element);
                                       s.push(Object.assign(d0, {to:d1}));
                                      return s;
                                      }, []);
        prev = elements;
        return obj;
      })
    };
}

module.exports = { generate };
