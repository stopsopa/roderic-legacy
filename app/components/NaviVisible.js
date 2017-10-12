
import React from 'react';

import Navi from './Navi';

import { connect } from 'react-redux';

import * as actions from '../actions';

import { getLoaderStatus, getList } from '../reducers';

import { withRouter } from 'react-router-dom';

const mapStateToProps = (state) => {
    return {
        on      : getLoaderStatus(state),
        // list    : getList(state)
    };
};

export default withRouter(connect(
    mapStateToProps,
    actions
)(Navi));