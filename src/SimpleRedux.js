//
// Super-simplified Redux
//
// Copyright (c) 2016 Satoshi Nakajima (https://github.com/snakajima)
// License: The MIT License
//

function createStore(reducer) {
    var state = reducer()
    var app;
    function dispatch(action) {
      state = reducer(state, action)
      if (app) {
        app.setState(state)
      }
    }
    function setApplication(obj) {
      app = obj;
      app.state = state;
    }
    function getState() {
      return state;
    }
    return { dispatch, setApplication, getState };
}

module.exports = createStore;

