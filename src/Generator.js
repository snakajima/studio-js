function generate(store) {
    const state = store.getState();
    var prev = {};
    const idsAll = state.elements.map((element) => element.id);
    return {
      type:"net.swipe.swipe",
      dimension:[240,240],
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
