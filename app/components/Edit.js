
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
            <div>form...</div>
            <div>
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
            </div>
        </form>
    );
};