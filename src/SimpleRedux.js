// Super-simplified Redux
function createStore(reducer) {
    var state = reducer()
    var app;
    function dispatch(action) {
      state = reducer(state, action)
      //console.log("store:dispatch width=", state.screen.width);
      app.setState(state)
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

