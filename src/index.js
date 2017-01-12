//
// Copyright (c) 2016 Satoshi Nakajima (https://github.com/snakajima)
// License: The MIT License
//

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Cursor from './Cursor';

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

ReactDOM.render(
  <Cursor />,
  document.getElementById('cursor')
);
