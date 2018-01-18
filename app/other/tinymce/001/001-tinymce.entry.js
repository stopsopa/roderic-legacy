
import React, { Component } from 'react';

import ReactDom from 'react-dom';

import TinyMce, { TinyMceExtendTest, setSource, defaultData } from './TinyMce';

setSource('/asset/public/tinymce/tinymce.js');

import 'normalize-css';

import './tinymce-custom.css';

class Parent extends Component {
    constructor() {
        super();
        this.state = {
            on: false,
            content: defaultData
        };
    }
    render() {

        return (
            <table width="100%">
                <tbody>
                    <tr>
                        <td width="50%">
                            <button key="button"
                                onClick={() => this.setState({on: !this.state.on})}
                            >toggle</button>
                            <button key="bimg"
                                onClick={() =>tinyMCE.execCommand('embed_image_from_gallery', {src:'//i.imgur.com/9ng3PRD.png'})}
                            >add image</button>
                        </td>
                        <td width="50%">

                        </td>
                    </tr>
                    <tr>
                        <td>
                            {this.state.on && <TinyMceExtendTest
                                onEditorChange={content => this.setState({content})}
                                content={this.state.content}
                            ></TinyMceExtendTest>}
                        </td>
                        <td valign="top">
                            <p className="tinymce" key="p" dangerouslySetInnerHTML={{__html: this.state.content}} />
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

ReactDom.render(
    <Parent></Parent>,
    document.getElementById('app')
);