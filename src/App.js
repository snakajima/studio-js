//
// Copyright (c) 2016 Satoshi Nakajima (https://github.com/snakajima)
// License: The MIT License
//

import React, { Component } from 'react';
import Editor from './Editor';
import Reducer from './Reducer';
import createStore from './SimpleRedux';
import UndoStack from './UndoStack';
import './App.css';

window.stack = new UndoStack();
window.store = createStore(Reducer.reducer);

class App extends Component {
  render() {
    return <Editor />
  }
}

export default App;
