//
// Copyright (c) 2016 Satoshi Nakajima (https://github.com/snakajima)
// License: The MIT License
//

import React, { Component } from 'react';

class Segment extends Component {
  constructor(props) {
    super();
  }
  onClickWithValue(value, count) {
    return (e) => {
      window.store.dispatch({type:'changeElement',
           set:{name:this.props.name, value:{style:value, count:count}}});
    }
  }
  
  render() {
    const cellStyle = {width:this.props.cellWidth, height:this.props.cellSize};
    const sections = this.props.choices.map((choice, index) => {
      var className = (index===0) ? 'segmentCellFirst' : 'segmentCell';
      if (choice === this.props.value.style) {
        className += ' segmentCellOn';
      }
      return <div className={className}
                  onClick={this.onClickWithValue(choice, this.props.value.count)}
                  key={choice}
                  style={cellStyle}>{choice}</div>;
    });
    return (
      <div style={{float:'left'}}>
        <div className='segmentFrame'>
          {sections}
        </div>
      </div>
    );
  }
}

export default Segment;
