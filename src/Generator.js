class Generator {
  constructor(store) {
    var state = store.getState();
    var prev = {};
    this.script = {
      type:"net.swipe.swipe",
      dimension:[240,135],
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
        var foo = {scene:"s0", elements:Object.keys(page).map((id) => {
            var element = Object.assign({id:id}, prev[id] || {});
            return Object.assign(element, {to:page[id]});
        })};
        prev = page;
        return foo;
      })
    };
  }
  generate() {
    var json = JSON.stringify(this.script, undefined, 2);
    return json;
  }
}

export default Generator;
