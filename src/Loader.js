//
// Copyright (c) 2016 Satoshi Nakajima (https://github.com/snakajima)
// License: The MIT License
//

function load(swipe, state) {
  const str = JSON.stringify(swipe, undefined, 2);
  console.log(str);
  return state;
}

module.exports = { load };
