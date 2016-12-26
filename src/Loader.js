//
// Copyright (c) 2016 Satoshi Nakajima (https://github.com/snakajima)
// License: The MIT License
//

function load(swipe, prevState) {
  const str = JSON.stringify(swipe, undefined, 2);
  console.log(str);
  const sceneElements = swipe.templates.pages.s0.elements;
  const elementMap = sceneElements.reduce((map, element)=>{
    map[element.id] = element;
    return map;
  }, {});
  const pages = swipe.pages.map((page) => {
    if (page.elements) {
      return page.elements.reduce((ret, element)=>{
        var value = {};
        const sceneElement = elementMap[element.id];
        console.log("load.map", sceneElement);
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
            if (sceneElement.rotate) {
              value.rotate -= sceneElement.rotate;
            }
          }
          if (element.to.scale) {
            value.scale = element.to.scale;
            if (sceneElement.scale) {
              value.scale[0] /= sceneElement.scale[0];
              value.scale[1] /= sceneElement.scale[1];
            }
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
    elements:sceneElements,
    pages:pages
  };
  return state;
}

module.exports = { load };
