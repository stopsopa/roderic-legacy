
// https://reacttraining.com/react-router/web/guides/quick-start

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { autobind } from 'core-decorators';
import log from '../../../react/webpack/logw';
import '../common/style.scss';

import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from 'react-router-dom';

const home = location.pathname;

const auth = {
    authenticated : false,
    login(cb) {
        this.authenticated = true;
        setTimeout(cb, 100);
    },
    signout(cb) {
        this.authenticated = false;
        setTimeout(cb, 100);
    }
};

@withRouter
class Status extends Component {
    @autobind
    logout() {

        const { history } = this.props;

        auth.signout(() => {
            log('push');
            history.push('/')
        })
    }
    render() {
        return (
            <div>
                {auth.authenticated
                    ? <p>You are logged in: <button onClick={this.logout}>Sign out</button></p>
                    : <p>You are not logged in.</p>
                }
            </div>
        );
    }
}
const Public = () => (
    <p>Public content.</p>
)
const Protected = () => (
    <p>Protected content.</p>
)

class BaseComponent extends Component {
    render() {
        return (
            <Router>
                <div>
                    <Status />
                    <ul>
                        <ul><Link to="/public">Public</Link></ul>
                        <ul><Link to="/protected">Protected</Link></ul>
                    </ul>

                    <Route path="/public" component={Public} />
                    <AuthRoute path="/protected" component={Protected} />

                    <Route path="/login" component={Login} />
                </div>
            </Router>
        );
    }
}

class AuthRoute extends Component {
    render() {

        const { component: Component, ...rest } = this.props;

        log('authRoute', this.props, rest)

        return (
            <Route {...rest} render={props => { // to get access to props.location
                log('render', props)
                return auth.authenticated
                    ? <Component {...props} />
                    : <Redirect to={{ // can redirect to object
                        pathname: '/login',
                        state: { from: props.location }
                    }} />
            }} />
        );
    }
}

class Login extends Component {
    state = {
        redirect: false
    }
    @autobind
    login() {
        auth.login(() => {
            this.setState({
                redirect: true
            });
        })
    }
    render() {

        log('pop', this.props);

        const { from } = this.props.location.state || { from: { pathname: '/' } }

        if (this.state.redirect) {

            return (
                <Redirect to={from} />
            );
        }

        return (
            <div>
                <p>You must login to access: {from.pathname}</p>
                <button onClick={this.login}>Log in</button>
            </div>
        );
    }
};

ReactDOM.render(
    <BaseComponent />,
    document.getElementById('app')
);