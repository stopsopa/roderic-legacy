'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import trim from 'lodash/trim';
import classnames from 'classnames';

// material-ui
//   icons: https://material.io/icons/

export default class Sandbox extends React.Component {
    MAX_RANGE = 100
    // https:1//facebook.github.io/react/docs/typechecking-with-proptypes.html
    static PropTypes = {
        // input: React.PropTypes.string.isRequired
        input: PropTypes.string.isRequired
    };
    constructor(...args) {
        super(...args);

        this.state = {
            input: '',
        };
    }
    setState() { // override
        log('setState')
        return super.setState.apply(this, arguments);
    }
    @autobind
    onChange(e) {
        this.setState((prevState, props) => ({
            input: !prevState.input
        }), () => {
            log('logic after state change')
        });
    }
    onFetch(method, e) {
    }
    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <label>
                    <input type="text" value={this.state.input} onChange={this.onChange} />
                </label>

                {this.state.multiple.map(function (i) {
                    return <img key={i} src={'/bundles/img/' + i + '.bmp'} />
                })}

                {Object.keys(this.state.list).map((i) => {
                    var item = this.state.list[i];
                    return <div key={i}>{item.name}</div>
                })}
                <button onClick={this.onFetch.bind(this, 'json')}></button>
            </form>
        );
    }
}

ReactDOM.render(
    <Sandbox />
    document.getElementById('app')
);

