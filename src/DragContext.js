
window.dragger = {}

function getContext() {
    return window.dragger;
}

function setContext(context) {
    window.dragger = context;
}

module.exports = { getContext, setContext };
