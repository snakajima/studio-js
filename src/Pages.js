import React, { Component } from 'react';
import Page from './Page';

class Pages extends Component {
  render() {
    const height = this.props.dimension.height * this.props.width / this.props.dimension.width;
    return (
      <div className='canvasPages'
           style={{height:this.props.height - height}}>{
        this.props.pages.map((page, index) => {
           return (<div key={index}>
                <Page pageIndex={index} page={page}
                  width={ this.props.width }
                  dimension={ this.props.dimension }
                  sceneElements={ this.props.sceneElements }
                />
                <div className="subToolbar">
                  <button onClick={()=>{window.store.dispatch({type:'deletePage', pageIndex:index})}} >Delete</button>
                  <button onClick={()=>{window.store.dispatch({type:'duplicatePage', page:page, pageIndex:index})}} >Duplicate</button>
                </div>
            </div>)
        })
      }</div>
    )
  }
}

export default Pages;
