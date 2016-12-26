//
// Copyright (c) 2016 Satoshi Nakajima (https://github.com/snakajima)
// License: The MIT License
//

function load(swipe, prevState) {
  const str = JSON.stringify(swipe, undefined, 2);
  console.log(str);
  const pages = swipe.pages.map((page) => {
    if (page.elements) {
      return page.elements.reduce((ret, element)=>{
        var value = {};
        if (element.to) {
          console.log('load:element=', JSON.stringify(element.to));
          if (element.to.translate) {
            value.translate = element.to.translate;
          }
          if (element.to.opacity) {
            value.opacity = element.to.opacity;
          }
          if (element.to.rotate) {
            value.rotate = element.to.rotate;
          }
          if (element.to.scale) {
            value.scale = element.to.scale;
          }
        }
        ret[element.id] = value;
        return ret;
      }, {});
    }
    return {}
  });
  var state = {
    selection:{ids:new Set()},
    pageIndex:0,
    preview:false,
    dimension:{ width:swipe.dimension[0] || 320, height:swipe.dimension[1] || 320 },
    elements:swipe.templates.pages.s0.elements,
    pages:pages
  };
  return state;
}

module.exports = { load };
