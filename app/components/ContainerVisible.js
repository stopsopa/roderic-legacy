
import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { autobind } from 'core-decorators';

import * as actions from '../actions';

import NaviVisible from './NaviVisible';

import {
    getLoaderStatus
} from '../reducers';

import routes from '../routes';

import {
    Button,
    Container,
    Header,
    List,
    Label,
    Menu,
    Icon
} from 'semantic-ui-react';

import { Route, Switch, Redirect, withRouter } from 'react-router-dom';

import RedirectUnauthorisedVisible from './RedirectUnauthorisedVisible';

const ContainerVisible = ({ loginSignOut, history }) => (
    <div className="main-container">

        <RedirectUnauthorisedVisible />

        <div>
            <Menu inverted>
                <Menu.Item onClick={() => history.push('/gui')}>
                    Ping service
                </Menu.Item>
                <Menu.Item position='right' onClick={loginSignOut}>
                    <Icon name="power"/>
                    Sign out
                </Menu.Item>
            </Menu>

        </div>

        <NaviVisible/>
        <div className="content">
            <Switch>
                {routes.map((route, i) => <Route key={i} {...route} />)}
                <Route render={() => (
                    <Redirect to="/gui"/>
                )}/>
            </Switch>
        </div>
    </div>
);

const mapStateToProps = (state) => ({
    on      : getLoaderStatus(state)
});

export default withRouter(connect(
    mapStateToProps,
    actions
)(ContainerVisible));