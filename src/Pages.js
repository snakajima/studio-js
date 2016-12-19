import React, { Component } from 'react';
import Page from './Page';

class Pages extends Component {
  render() {
    return (
      <div className='canvasPages'>{
        this.props.pages.map((page, index) => {
           return <Page key={index} pageIndex={index} page={page}
               width={ this.props.width }
               sceneElements={ this.props.sceneElements }
               scale={0.5} />
        })
      }</div>
    )
  }
}

export default Pages;
