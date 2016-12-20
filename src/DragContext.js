//
// Copyright (c) 2016 Satoshi Nakajima (https://github.com/snakajima)
// License: The MIT License
//

window.dragger = {}

function getContext() {
    return window.dragger;
}

function setContext(context) {
    window.dragger = context;
}

module.exports = { getContext, setContext };
