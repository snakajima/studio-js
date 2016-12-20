//
// Copyright (c) 2016 Satoshi Nakajima (https://github.com/snakajima)
// License: The MIT License
//

function generate(store) {
    const state = store.getState();
    var prev = {};
    const idsAll = state.elements.map((element) => element.id);
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
        const ids = idsAll.filter((id) => (prev[id] || page[id]));
        if (ids.length > 0) {
          obj.elements = ids.map((id) => {
            let element = Object.assign({id:id}, prev[id] || {});
            return Object.assign(element, {to:page[id] || {translate:[0,0]}});
          })
        };
        prev = page;
        return obj;
      })
    };
}

module.exports = { generate };
