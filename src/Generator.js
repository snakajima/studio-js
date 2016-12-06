class Generator {
  constructor(store) {
    this.state = store.getState();
  }
  
  generate() {
    var prev = {};
    return {
      type:"net.swipe.swipe",
      dimension:[240,135],
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
        var foo = {scene:"s0", elements:Object.keys(page).map((id) => {
            var element = Object.assign({id:id}, prev[id] || {});
            return Object.assign(element, {to:page[id]});
        })};
        prev = page;
        return foo;
      })
    };
  }
}

export default Generator;