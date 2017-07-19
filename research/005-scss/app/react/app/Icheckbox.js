'use strict';

import React from 'react';
import './icontrol_big_gray.css';
import PropTypes from 'prop-types'; // ES6

export default class Icheckbox extends React.Component {
    static PropTypes = {
        label: PropTypes.string.isRequired
    };
    constructor(...args) {
        super(...args);
    }
    componentDidMount() {
        var that = this;
        // ajax.json(this.props.url, null, function (json) {
        //     setTimeout(function () {
        //         that.setState(json);
        //     }, 1000);
        // });
    }
    render() {
        let {label} = this.props;
        return (
            <label className="icontrol" {...this.props}>
                <input type="checkbox"
                       checked={this.props.checked}
                       onChange={this.props.onChange}
                />
                <span className="fake"></span>
                {label}
            </label>
        );
    }
}