//
// Copyright (c) 2016 Satoshi Nakajima (https://github.com/snakajima)
// License: The MIT License
//

import React, { Component } from 'react';
import Generator from './Generator';

class Preview extends Component {
    render() {
        const width = this.props.width-200;
        const height = this.props.dimension.height * width / this.props.dimension.width;
        return(
               <div className="previewFrame" onClick={()=>{window.store.dispatch({type:'preview', preview:false})}}>
               <iframe src="./preview.html" className='preview'
               style={{width:width, height:height + 100,left:100,top:100}}
               ref={(iframe)=>{ this.iframe = iframe; }} />
               </div>
               )
    }
    componentDidMount() {
        const previewWindow = this.iframe.contentWindow;
        const swipe = Generator.generate(window.store);
        const str = JSON.stringify(swipe, undefined, 2);
        console.log(str);
        previewWindow.swipe = str;
    }
}

export default Preview;
