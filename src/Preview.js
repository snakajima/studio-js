import React, { Component } from 'react';
import Generator from './Generator';

class Preview extends Component {
    render() {
        return(
               <div className="previewFrame" onClick={()=>{window.store.dispatch({type:'preview', preview:false})}}>
               <iframe src="./preview.html" className='preview'
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
