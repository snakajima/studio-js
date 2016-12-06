class Publisher {
  constructor(store) {
    var state = store.getState();
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
        return {scene:"s0", elements:Object.keys(page).map((id) => {
            return Object.assign({id:id}, {to:page[id]});
        })};
      })
    };
  }
  swipe() {
    var json = JSON.stringify(this.script, undefined, 2);
    console.log(json);
    return json;
  }
}

export default Publisher;
