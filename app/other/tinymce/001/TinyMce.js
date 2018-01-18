
import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Inspired by : https://go.tinymce.com/blog/how-to-integrate-react-with-tinymce/
 * g(How to integrate React with TinyMCE)
 *
 * it was designed to work with TinyMCE version:
 */
class TinyMce extends Component {
    static propTypes = {
        content: PropTypes.string, // https://www.youtube.com/watch?v=WE3XAt9P8Ek
        extendInit: PropTypes.func,
        extendEditor: PropTypes.func,
        onEditorChange: PropTypes.func
    };
    constructor(props, ...rest) {
        super(props, ...rest);
        this.state = {
            editor: null
        };
    }
    componentDidMount() {

        let init = {

            // selector: `#${this.state.id}`,
            target: this.element, // https://www.tinymce.com/docs/configure/integration-and-setup/#setup

            setup: editor => {

                this.setState({ editor });

                if (this.props.extendEditor) {

                    this.props.extendEditor(editor);
                }

                if (this.props.onEditorChange) {

                    editor.on('keyup change Redo Undo', () => {
                        this.props.onEditorChange(editor.getContent(), editor);
                    });
                }
            }
        };

        if (this.props.extendInit) {

            this.props.extendInit(init);
        }

        tinymce.init(init);
    }
    componentWillUnmount() {
        tinymce.remove(this.state.editor);
    }
    render() {
        return (
            <textarea
                ref={node => this.element = node}
                defaultValue={this.props.content}
                // onChange={e => console.log('t', (new Date()).toISOString().substring(0, 19).replace('T', ' '), e)}
            />
        );
    }
}

export default TinyMce;

export class TinyMceExtendTest extends Component {
    extendEditor = editor => { // https://www.tinymce.com/docs/plugins/insertdatetime/

        function toTimeHtml(date) {
            return '<time datetime="' + date.toString() + '">' + date.toDateString() + '</time>';
        }

        editor.addButton('customimg', {
            // text: "My Button",
            // to see all icons use online tool http://jsfiddle.net/iegik/r4ckgdc0/
            // and upload file /node_modules/tinymce/skins/lightgray/fonts/tinymce.svg
            icon: 'customimg',

            // <path d="M1088 128h-64v-64c0-35.2-28.8-64-64-64h-896c-35.2 0-64 28.8-64 64v768c0 35.2 28.8 64 64 64h64v64c0 35.2 28.8 64 64 64h896c35.2 0 64-28.8 64-64v-768c0-35.2-28.8-64-64-64zM128 192v640h-63.886c-0.040-0.034-0.082-0.076-0.114-0.116v-767.77c0.034-0.040 0.076-0.082 0.114-0.114h895.77c0.040 0.034 0.082 0.076 0.116 0.116v63.884h-768c-35.2 0-64 28.8-64 64v0zM1088 959.884c-0.034 0.040-0.076 0.082-0.116 0.116h-895.77c-0.040-0.034-0.082-0.076-0.114-0.116v-767.77c0.034-0.040 0.076-0.082 0.114-0.114h895.77c0.040 0.034 0.082 0.076 0.116 0.116v767.768z"></path>
            tooltip: "Insert image from gallery",
            onclick: () => {
                editor.insertContent(toTimeHtml(new Date()));

                editor.insertContent('<img src="//i.imgur.com/F7eQzPK.png">');
            }
        });

        editor.addCommand("embed_image_from_gallery", function (item) {
            editor.insertContent('<img src="' + item.src + '">');

            // tinyMCE.execCommand('embed_image_from_gallery', {src:''});
        });


        editor.on('init', e => {

            try {
                const iframe = editor.getElement().previousSibling.querySelector('iframe'); // https://stackoverflow.com/a/7649405/5560682

                const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

                const style = iframeDocument.querySelector('[id="u0"]');

                style.parentNode.removeChild(style);
            }
            catch (e) {
                log("Can't find textare of tinymce...");
            }
        });
    }
    render() {
        return <TinyMce
            {...this.props}
            extendInit={init => {

                return Object.assign(init, {
                    // plugins: 'wordcount table',
                    plugins: [ //https://www.tinymce.com/docs/get-started/basic-setup/#breakdownoftheaboveexample
                        'advlist autolink link image lists charmap hr anchor pagebreak spellchecker',
                        'searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime nonbreaking',
                        'save table contextmenu directionality template paste',

                        'imagetools' // extra plugins
                    ],
                    toolbar: 'insertfile undo redo | styleselect | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | table | bullist numlist outdent indent | link image | code fullscreen customimg',

                    // toolbar: [ // https://www.tinymce.com/docs/get-started/basic-setup/#example
                    //     'undo redo | styleselect | bold italic | link image',
                    //     'alignleft aligncenter alignright'
                    // ],
                    // width: 600,
                    height: 900,
                    content_css: [
                        '/asset/public/normalize-css/normalize.css',
                        '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
                        '/asset/other/tinymce/001/tinymce-custom.css'
                    ],
                    body_class: 'tinymce',

                    // https://www.tinymce.com/docs/configure/content-filtering/#valid_elements
                    // valid_elements : 'a[href|target|id],strong/b,pre,hr,div[align],blockquote,code,table[style|border|cellspacing|cellpadding|width|frame|rules|height|align|summary|bgcolor|background|bordercolor],tbody,catption,tr,td,th,br,h1[style],br,h2[style],h3[style],h4[style],h5[style],h6[style],ul,ol,li,sup,sub,p[style],span[style],em,img[id|src|border=0|alt|title|hspace|vspace|width|height|align]',
                    forced_root_blocks: false,
                    remove_trailing_brs: false,
                    keep_styles: false // https://www.tinymce.com/docs/configure/content-filtering/#keep_styles
                });

                return init;
            }}
            extendEditor={this.extendEditor}
        />
    }
}

/**
 * Example content:
 <p>Test <strong>bolddd</strong></p>
 <p><sup><strong>fdsafdsa</strong></sup></p>
 <p>test</p>
 <p><sub>fdsafdsa</sub></p>
 <h1><strong>fds</strong>afda<strong>sfsa f<em>ds</em>a fdsa fdsa</strong></h1>
 <table style="height: 54px; width: 100%; border-color: darkgray; background-color: lightgray; margin-left: auto; margin-right: auto;" border="1" cellspacing="1" cellpadding="1">
 <tbody>
 <tr>
 <td>fdsaf<br /></td>
 <td><br /></td>
 <td>fdsa<br /></td>
 </tr>
 <tr>
 <td><br /></td>
 <td><br /></td>
 <td><br /></td>
 </tr>
 <tr>
 <td>fdsa<br /></td>
 <td><br /></td>
 <td>ddsaf</td>
 </tr>
 </tbody>
 </table>
 <p><br /></p>
 <ul>
 <li><strong>one</strong></li>
 <li><strong>two</strong></li>
 </ul>
 <ol>
 <li><strong>three</strong></li>
 <li>four<br /><br /><br /><br /><br /><br /></li>
 </ol>
 <p><br /></p>
 <p><br /></p>
 <p><a href="http://google.com">http://google.com</a></p>
 <p><img src="https://i.imgur.com/F7eQzPK.png" alt="" width="60" height="60" border="0" /><img src="//i.imgur.com/9ng3PRD.png" border="0" /></p>
 <blockquote>
 <p>blockquote</p>
 </blockquote>
 <div>div</div>
 <pre>pre</pre>
 <p>&nbsp;</p>
 */
