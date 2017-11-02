
import React from 'react';

import Navi from './Navi';

import { connect } from 'react-redux';

import * as actions from '../actions';

import {
    getLoaderStatus,
    getList,
    getLoaderButtonVisible
} from '../reducers';

import { withRouter } from 'react-router-dom';

const mapStateToProps = state => {
    return {
        on      : getLoaderStatus(state),
        buttonsVisible: getLoaderButtonVisible(state)
        // list    : getList(state)
    };
};

export default withRouter(connect(
    mapStateToProps,
    actions
)(Navi));