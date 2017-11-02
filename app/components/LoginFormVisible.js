
import React from 'react';

import { connect } from 'react-redux';

import LoginForm from './LoginForm';

import {
    loginSignOut
} from '../actions';

import {
    getAuthenticated,
    getLoading,
    getLoginError
} from '../reducers';

const mapStateToProps = state => ({
    authenticated: getAuthenticated(state),
    loading: getLoading(state),
    error: getLoginError(state)
});

export default connect(
    mapStateToProps,
    {
        onSignOut: loginSignOut
    }
)(LoginForm);