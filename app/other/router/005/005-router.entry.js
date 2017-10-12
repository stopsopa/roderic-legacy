
// https://reacttraining.com/react-router/web/guides/quick-start

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { autobind } from 'core-decorators';
import log from '../../../../react/webpack/logw';
import '../common/style.scss';

import { BrowserRouter as Router, Route, Link, Switch, Redirect, withRouter, Prompt } from 'react-router-dom';

const home = '/router/005';

const NoMatchExample = () => (
    <Router>
        <div>
            <ul>
                <li><Link to={`${home}/`}>Home</Link></li>
                <li><Link to={`${home}/old-match`}>Old Match, to be redirected</Link></li>
                <li><Link to={`${home}/will-match`}>Will Match</Link></li>
                <li><Link to={`${home}/will-not-match`}>Will Not Match</Link></li>
                <li><Link to={`${home}/also/will/not/match`}>Also Will Not Match</Link></li>
            </ul>
            <Switch>
                <Route path={`${home}/`} exact component={Home}/>
                <Redirect from={`${home}/old-match`} to={`${home}/will-match`}/>
                <Route path={`${home}/will-match`} component={WillMatch}/>
                <Route component={NoMatch}/>
            </Switch>
        </div>
    </Router>
)

const Home = () => (
    <p>
        A <code>&lt;Switch></code> renders the
        first child <code>&lt;Route></code> that
        matches. A <code>&lt;Route></code> with
        no <code>path</code> always matches.
    </p>
)

const WillMatch = () => <h3>Matched!</h3>

const NoMatch = ({ location }) => (
    <div>
        <h3>No match for <code>{location.pathname}</code></h3>
    </div>
)

ReactDOM.render(
    <NoMatchExample />,
    document.getElementById('app')
);