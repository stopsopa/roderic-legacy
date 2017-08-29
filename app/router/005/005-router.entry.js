
// https://reacttraining.com/react-router/web/guides/quick-start

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { autobind } from 'core-decorators';
import log from '../../../react/webpack/logw';
import '../common/style.scss';

import { BrowserRouter as Router, Route, Link, Switch, Redirect, withRouter, Prompt } from 'react-router-dom';


const NoMatchExample = () => (
    <Router>
        <div>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/old-match">Old Match, to be redirected</Link></li>
                <li><Link to="/will-match">Will Match</Link></li>
                <li><Link to="/will-not-match">Will Not Match</Link></li>
                <li><Link to="/also/will/not/match">Also Will Not Match</Link></li>
            </ul>
            <Switch>
                <Route path="/" exact component={Home}/>
                <Redirect from="/old-match" to="/will-match"/>
                <Route path="/will-match" component={WillMatch}/>
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