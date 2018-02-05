
import React, { Component } from 'react';

import * as actions from '../actions';

import NestedGetDataVisible from './NestedGetDataVisible';

const imgTest = '/asset/other/scss/inc/jpg/all.jpg';

const JustString = () => "just string...";

export default class Edit extends Component {
    static displayName = 'EditComponent'; // https://reactjs.org/docs/react-component.html#displayname
    static fetchData = (store, routerParams) => {
        return Promise.all([
            // store.dispatch(actions.fetchList()),
            store.dispatch(actions.nestedLoad(`other then router component`))
        ]);
    }
    render = () => (
        <form>
            <table>
                <tbody>
                    <tr>
                        <td>
                            form...
                            <NestedGetDataVisible />
                            <br/>
                            <a href={imgTest}>
                                <img
                                    src={imgTest}
                                    alt="imgTest"
                                />
                            </a>
                            <br />
                            <JustString />
                        </td>
                        <td>
                            <ul>
                                <li><a target="_blank" href="../../motion/index.html">/motion/index.html</a></li>
                                <li><a target="_blank" href="../../other/flexbox/index.html">/other/flexbox/index.html</a></li>
                                <ul>
                                    <li><a target="_blank" href="../../redux/001-createstore/app.html">/redux/001-createstore/app.html</a></li>
                                    <li><a target="_blank" href="../../redux/002-createstore-own/app.html">/redux/002-createstore-own/app.html</a></li>
                                    <li><a target="_blank" href="../../redux/003-react/app.html">/redux/003-react/app.html</a></li>
                                    <li><a target="_blank" href="../../redux/004-counters/app.html">/redux/004-counters/app.html</a></li>
                                    <li><a target="_blank" href="../../redux/005-advanced/app.html">/redux/005-advanced/app.html</a></li>
                                </ul>
                                <li><a target="_blank" href="../.."></a></li>
                                <ul>
                                    <li><a target="_blank" href="../../bootstrap.html">/bootstrap.html</a></li>
                                    <li><a target="_blank" href="../../index-dir.html">/index-dir.html</a></li>
                                    <li><a target="_blank" href="../../react.html">/react.html <span style={{color:'red'}}>(form)</span></a></li>
                                    <li><a target="_blank" href="../../scss.html">/scss.html</a></li>
                                </ul>
                                <li><a target="_blank" href="../.."></a></li>
                                <ul>
                                    <li><a target="_blank" href="../../router/001/app.html">/router/001/app.html</a></li>
                                    <li><a target="_blank" href="../../router/002/app.html">/router/002/app.html</a></li>
                                    <li><a target="_blank" href="../../router/003/app.html">/router/003/app.html</a></li>
                                    <li><a target="_blank" href="../../router/004/app.html">/router/004/app.html</a></li>
                                    <li><a target="_blank" href="../../router/005/app.html">/router/005/app.html</a></li>
                                    <li><a target="_blank" href="../../router/006/app.html">/router/006/app.html</a></li>
                                </ul>
                            </ul>
                        </td>
                    </tr>
                </tbody>
            </table>
        </form>
    );
};