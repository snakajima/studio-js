//
// Copyright (c) 2016 Satoshi Nakajima (https://github.com/snakajima)
// License: The MIT License
//

import React, { Component } from 'react';

class Selection extends Component {
  constructor(props) {
    super();
  }
  
  render() {
    const scale = this.props.scale;
    return (
      <div className='canvasElement' style={{
          left:this.props.element.x * scale-2, top:this.props.element.y * scale-2,
          width:this.props.element.w * scale, height:this.props.element.h * scale,
          border:"2px solid blue"
        }}
      >
      </div>
    );
  }
}

export default Selection;
