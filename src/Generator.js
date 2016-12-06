class Generator {
  constructor(store) {
    this.state = store.getState();
  }
  
  generate() {
    var prev = {};
    return {
      type:"net.swipe.swipe",
      dimension:[240,240],
      paging:"leftToRight",
      orientation:"landscape",
      templates:{
        pages:{
          s0:{
            play: "scroll",
            elements: this.state.elements
          }
        }
      },
      pages: this.state.pages.map((page) => {
        var obj = {template:"s0"}
        var ids = Object.keys(page);
        if (ids.length > 0) {
          obj.elements = ids.map((id) => {
            var element = Object.assign({id:id}, prev[id] || {});
            return Object.assign(element, {to:page[id]});
          })
        };
        prev = page;
        return obj;
      })
    };
  }
}

export default Generator;
