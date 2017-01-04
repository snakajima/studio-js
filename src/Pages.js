//
// Copyright (c) 2016 Satoshi Nakajima (https://github.com/snakajima)
// License: The MIT License
//

import React, { Component } from 'react';
import Page from './Page';

class Pages extends Component {
  render() {
    const height = this.props.dimension.height * this.props.width / this.props.dimension.width;
    const clientWidth = this.props.width - this.props.scrollbarWidth;
    return (
      <div className='canvasPages'
            style={{height:this.props.height - height, width:this.props.width }}>{
        this.props.pages.map((page, index) => {
             return (<div key={index} style={{width:clientWidth}} >
                <Page pageIndex={index} page={page}
                  width={ clientWidth }
                  dimension={ this.props.dimension }
                  sceneElements={ this.props.sceneElements }
                  main={false}
                  selected={ index===this.props.selectedPageIndex }
                />
                <div className="subToolbar">
                  <input className="btnSM" type="image" src="./ic_color_delete.png" onClick={()=>{window.store.dispatch({type:'deletePage', pageIndex:index})}} />
                  <input className="btnSM" type="image" src="./ic_color_duplicate.png" onClick={()=>{window.store.dispatch({type:'duplicatePage', page:page, pageIndex:index})}} />
                </div>
            </div>)
        })
      }</div>
    )
  }
}

export default Pages;
