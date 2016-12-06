
var dragger = {}

function getContext() {
    return dragger;
}

function setContext(context) {
    dragger = context;
}

module.exports = { getContext, setContext };
