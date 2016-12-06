// Super-simplified Redux
function createStore(reducer) {
    var state = reducer()
    var app;
    function dispatch(action) {
      state = reducer(state, action)
      app.setState(state)
    }
    function setApplication(obj) {
      app = obj;
      app.states = state;
    }
    function getState() {
      return state;
    }
    return { dispatch, setApplication, getState };
}

module.exports = createStore;

