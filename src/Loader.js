//
// Copyright (c) 2016 Satoshi Nakajima (https://github.com/snakajima)
// License: The MIT License
//

function load(swipe, prevState) {
  const str = JSON.stringify(swipe, undefined, 2);
  console.log(str);
  var state = {
    selection:{ids:new Set()},
    pageIndex:0,
    preview:false,
    dimension:{ width:swipe.dimension[0] || 320, height:swipe.dimension[1] || 320 },
    elements:swipe.templates.pages.s0.elements,
    pages:[{}]
  };
  return state;
}

module.exports = { load };
