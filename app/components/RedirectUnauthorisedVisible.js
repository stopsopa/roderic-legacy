
import React from 'react';

import { Redirect } from 'react-router-dom';

import { connect } from 'react-redux';

import {
    getAuthenticated
} from '../reducers';

import configPublic from '../public.config';

const RedirectUnauthorisedVisible = ({ authenticated }) =>
    (authenticated ? null : <Redirect to={configPublic.jwt.loginUrl} />)
;

export default connect(state => ({
    authenticated: getAuthenticated(state)
}))(RedirectUnauthorisedVisible);