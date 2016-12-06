import React, { Component } from 'react';
import Page from './Page';

class Pages extends Component {
  constructor(props) {
    super();
  }
    
  render() {
    return (
      <div>{
        this.props.pages.map((page, index)=>{ return <Page key={index} pageIndex={index} page={page} sceneElements={ this.props.sceneElements } /> } )
      }</div>
    )
  }
}

export default Pages;
