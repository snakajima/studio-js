import React, { Component } from 'react';
import Page from './Page';

class Pages extends Component {
  render() {
    const height = this.props.dimension.height * this.props.width / this.props.dimension.width;
    return (
      <div className='canvasPages'
           style={{height:this.props.height - height}}>{
        this.props.pages.map((page, index) => {
           return <Page key={index} pageIndex={index} page={page}
               width={ this.props.width }
               dimension={ this.props.dimension }
               sceneElements={ this.props.sceneElements }
               />
        })
      }</div>
    )
  }
}

export default Pages;
